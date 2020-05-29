locals {
  region = "eu-west-1"
  aws_account_number = "827980728761"
}

terraform {  
  backend "s3" {
    bucket  = "lambda-terraform-infrastructure-state"
    encrypt = true
    key     = "terraform.tfstate"    
    region  = "eu-west-1"
  }
}

module init {
  source = "../../init"
  aws_account_number = local.aws_account_number
  aws_region = local.region
} 

module main {
  env = "dev"
  source = "../../main"
  aws_account_number = local.aws_account_number
  aws_region = local.region
  mysql_master_password_encrypted = "AQICAHg9pqX0o7mMO55zzW12P5epJo2I4CwJusOdGVYv5uZIBAH9g4Xy4Dv8u3bN6f5BNcpYAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMhzPXEA87NNF+JXttAgEQgCc/ulHYtPqUX5zcVQv5TyK92eJ1hrCL8a2ArE/pPji212l26v+uZ3g="
  mysql_application_user_password_encrypted = "AQICAHg9pqX0o7mMO55zzW12P5epJo2I4CwJusOdGVYv5uZIBAH9g4Xy4Dv8u3bN6f5BNcpYAAAAajBoBgkqhkiG9w0BBwagWzBZAgEAMFQGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMhzPXEA87NNF+JXttAgEQgCc/ulHYtPqUX5zcVQv5TyK92eJ1hrCL8a2ArE/pPji212l26v+uZ3g="
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