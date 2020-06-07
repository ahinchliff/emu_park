resource "aws_apigatewayv2_deployment" "websockets" {
  api_id = aws_apigatewayv2_api.websockets.id
  depends_on = [
    aws_apigatewayv2_route.connect,
    aws_apigatewayv2_route.disconnect,
    aws_apigatewayv2_route.authenticate,
  ]
}

resource "aws_apigatewayv2_api" "websockets" {
  name                       = "websockets"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id        = aws_apigatewayv2_api.websockets.id
  name          = "live"
  deployment_id = aws_apigatewayv2_deployment.websockets.id
}

resource "aws_apigatewayv2_integration" "connect" {
  api_id             = aws_apigatewayv2_api.websockets.id
  integration_type   = "AWS_PROXY"
  description        = "connect"
  integration_uri    = module.inbound_web_socket_handler.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "connect" {
  api_id         = aws_apigatewayv2_api.websockets.id
  route_key      = "$connect"
  operation_name = "connect"
  target         = "integrations/${aws_apigatewayv2_integration.connect.id}"
}

resource "aws_apigatewayv2_integration" "disconnect" {
  api_id             = aws_apigatewayv2_api.websockets.id
  integration_type   = "AWS_PROXY"
  description        = "disconnect"
  integration_uri    = module.inbound_web_socket_handler.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id         = aws_apigatewayv2_api.websockets.id
  route_key      = "$disconnect"
  operation_name = "disconnect"
  target         = "integrations/${aws_apigatewayv2_integration.disconnect.id}"
}

resource "aws_apigatewayv2_integration" "authenticate" {
  api_id             = aws_apigatewayv2_api.websockets.id
  integration_type   = "AWS_PROXY"
  description        = "authenticate"
  integration_uri    = module.inbound_web_socket_handler.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "authenticate" {
  api_id         = aws_apigatewayv2_api.websockets.id
  route_key      = "authenticate"
  operation_name = "authenticate"
  target         = "integrations/${aws_apigatewayv2_integration.authenticate.id}"
}

module inbound_web_socket_handler {
  source = "../shared/lambda"
  name = "inbound-web-socket-handler"
  source_file = "../../../.webpack/inbound-web-socket-handler.js"
}

module "config_access" {
  source = "../shared/config-access-policy"
  resource_name = "inbound_web_socket_handler"
  resource_role_id = module.inbound_web_socket_handler.role
}


resource "aws_iam_role_policy" "lambda_can_access_dynamodb_policy" {
  name   = "inbound_web_socket_handler_can_access_dynamodb"
  role   = module.inbound_web_socket_handler.role
  policy = data.aws_iam_policy_document.lambda_policy_document.json
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions = [
      "dynamodb:Query",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = [aws_dynamodb_table.connections.arn, "${aws_dynamodb_table.connections.arn}/index/*"]
  }

  statement {
    actions = [
      "execute-api:ManageConnections"
    ]
    resources = [
      "${aws_apigatewayv2_stage.stage.execution_arn}/DELETE/@connections/{connectionId}"
    ]
  }
}

resource "aws_lambda_permission" "lambda_can_be_invoked_by_agw" {
  action        = "lambda:InvokeFunction"
  function_name = module.inbound_web_socket_handler.name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_dynamodb_table" "connections" {
  name           = var.dynamo_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "connectionId"
    type = "S"
  }

  attribute {
    name = "room"
    type = "S"
  }

  global_secondary_index {
    name               = "connectionId"
    hash_key           = "connectionId"
    range_key          = "room"
    write_capacity     = 20
    read_capacity      = 20
    projection_type    = "ALL"
  }

  global_secondary_index {
    name               = "room"
    hash_key           = "room"
    range_key          = "connectionId"
    write_capacity     = 20
    read_capacity      = 20
    projection_type    = "ALL"
  }

  tags = {
    Name = var.dynamo_table_name
  }
}

