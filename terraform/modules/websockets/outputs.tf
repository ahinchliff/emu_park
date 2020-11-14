output "endpoint" {
  value = aws_apigatewayv2_stage.stage.invoke_url
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.connections.arn
}

output "apigw_arn" {
  value = aws_apigatewayv2_stage.stage.execution_arn
}