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
  mysql_master_password_encrypted = "AQICAHhHq1MhdnWTg+wiyO3+IjxBeUtrGjmglKfBIzLugEwkvAEf2G9CJVsewNIdpQ6mmv2jAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMq7Z7Wma9vFBxG/TpAgEQgCYGlRc5Jtqp6hsoB6TCtEMJ9Rzy1mOcEdR/wMCDC2N0rDbYTzD+mw=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHhHq1MhdnWTg+wiyO3+IjxBeUtrGjmglKfBIzLugEwkvAEf2G9CJVsewNIdpQ6mmv2jAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMq7Z7Wma9vFBxG/TpAgEQgCYGlRc5Jtqp6hsoB6TCtEMJ9Rzy1mOcEdR/wMCDC2N0rDbYTzD+mw=="
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