locals {
  # todo
  project_name = "personal-4"
  # todo
  environment = "development"
  # todo
  region = "eu-west-1"
  # todo
  aws_account_number = "144453885675"
  # todo
  mysql_master_password_encrypted = "AQICAHgRg8w6BXVTjss8C78uQMnIpD8R2PQqcIHt42NIIRFzcwFiBwb2YhFudXI9FoM/oNoiAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMxfhN/FAd0+OS4iuwAgEQgCZrXQjCznzz+UuW+2+HWhx8YLOiu5Uj7SdJ7aRiasYKC4j9Cd/sow=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHgRg8w6BXVTjss8C78uQMnIpD8R2PQqcIHt42NIIRFzcwFiBwb2YhFudXI9FoM/oNoiAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMxfhN/FAd0+OS4iuwAgEQgCZrXQjCznzz+UuW+2+HWhx8YLOiu5Uj7SdJ7aRiasYKC4j9Cd/sow=="
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

module stack {
  source = "../../stack"
  environment = local.environment
  project_name = local.project_name
  aws_account_number = local.aws_account_number
  aws_region = local.region
  mysql_master_password_encrypted = local.mysql_master_password_encrypted
  mysql_application_user_password_encrypted = local.mysql_application_user_password_encrypted
}