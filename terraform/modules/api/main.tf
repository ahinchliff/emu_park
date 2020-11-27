resource "aws_api_gateway_deployment" "api" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.environment
  depends_on = [
    aws_api_gateway_integration.lambda,
  ]
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "api"
}

 resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.lambda.invoke_arn
}

module lambda {
  source = "../shared/lambda"
  name = "api"
  handler = "src/index.api"
  source_file = "../../../api/.serverless/api.zip"
  timeout = 10
}

resource "aws_iam_role_policy" "lambda_can_access_websockets_policy" {
  name   = "api_access_websocket_dynamodb"
  role   = module.lambda.role
  policy = data.aws_iam_policy_document.lambda_can_access_websockets_policy.json
}

data "aws_iam_policy_document" "lambda_can_access_websockets_policy" {
  statement {
    actions = [
      "dynamodb:Query",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [var.web_sockets_dynamo_table_arn, "${var.web_sockets_dynamo_table_arn}/index/*"]
  }

  statement {
    actions = [
      "execute-api:ManageConnections"
    ]
    resources = [
      "${var.web_sockets_apigw_arn}/*/@connections/{connectionId}"
    ]
  }
}

resource "aws_lambda_permission" "api_lambda_can_be_invoked_by_agw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

module "config_access" {
  source = "../shared/config-access-policy"
  resource_name = "api"
  resource_role_id = module.lambda.role
  param_arns = var.config_param_arns
}