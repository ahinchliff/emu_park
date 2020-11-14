output "api_endpoint" {
  value = module.api.api_endpoint
}

output "database_address" {
  value = module.data.mysql_address
}

output "websocket_endpoint" {
  value = module.websockets.endpoint
}

