resource "aws_lambda_function" "lambda" {
  function_name    = var.name
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  handler          = "${var.name}.handler"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs12.x"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = var.source_file
  output_path = "/tmp/${var.name}.zip"
}

resource "aws_iam_role" "lambda" {
  name = "lambda_${var.name}"
  assume_role_policy = data.aws_iam_policy_document.assume_policy.json
}

data "aws_iam_policy_document" "assume_policy" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "role_policy" {
  name   = "${var.name}_write_logs"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.policy.json
}

data "aws_iam_policy_document" "policy" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [aws_cloudwatch_log_group.logs.arn]
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 60
}