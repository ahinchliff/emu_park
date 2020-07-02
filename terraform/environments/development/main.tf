locals {
  # todo
  region = "eu-west-1"
  # todo
  aws_account_number = "144453885675"
  # todo
  mysql_master_password_encrypted = "AQICAHgdilSt0LhS24g3qVJjSto02b7J8tGRHIqFXzKw5TbvEAHn3IeRVHYs4vpfZE3WfXRoAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM+ctNYeUu/xX5m9xPAgEQgCZZyRQ2GpJziVA1Bwz4p1kp9HAhvEQayShWj2F4mbsLpq1frdZ+Qw=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHgdilSt0LhS24g3qVJjSto02b7J8tGRHIqFXzKw5TbvEAHn3IeRVHYs4vpfZE3WfXRoAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM+ctNYeUu/xX5m9xPAgEQgCZZyRQ2GpJziVA1Bwz4p1kp9HAhvEQayShWj2F4mbsLpq1frdZ+Qw=="
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