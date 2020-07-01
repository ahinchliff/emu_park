locals {
  # todo
  region = "eu-west-1"
  # todo
  aws_account_number = "144453885675"
  # todo
  mysql_master_password_encrypted = "AQICAHjb13I+B6VS9i+FpCKSMpp51Y6jD7fIhRD0gx4U7GUEgAFtGqx9o6UUqklQ9X5OZFuvAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMJSk6jYKA0uK0nTrMAgEQgCcBO2FjAQsxfJiPnWW6okJ8SYoOIeDWWhhKinA2pxZapu9tPl9Db5U="
  # todo
  mysql_application_user_password_encrypted = "AQICAHjb13I+B6VS9i+FpCKSMpp51Y6jD7fIhRD0gx4U7GUEgAFtGqx9o6UUqklQ9X5OZFuvAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMJSk6jYKA0uK0nTrMAgEQgCcBO2FjAQsxfJiPnWW6okJ8SYoOIeDWWhhKinA2pxZapu9tPl9Db5U="
}

terraform {  
  backend "s3" {
    # todo
    bucket  = "personal-4-terraform"
    encrypt = true
    key     = "terraform.tfstate"
    # todo
    region  = "eu-west-1"
  }
}

module init {
  source = "../../init"
  aws_account_number = local.aws_account_number
  aws_region = local.region
} 

module main {
  env = "development"
  source = "../../main"
  aws_account_number = local.aws_account_number
  aws_region = local.region
  mysql_master_password_encrypted = local.mysql_master_password_encrypted
  mysql_application_user_password_encrypted = local.mysql_application_user_password_encrypted
}

output "api_endpoint" {
  value = module.main.api_endpoint
}

output "database_address" {
  value = module.main.database_address
}

output "websocket_endpoint" {
  value = module.main.websocket_endpoint
}