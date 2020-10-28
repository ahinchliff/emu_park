locals {
  # todo
  project_name = "gotcha-dev"
  # todo
  environment = "development"
  # todo
  region = "eu-west-1"
  # todo
  aws_account_number = "224937332002"
  # todo
  mysql_master_password_encrypted = "AQICAHj/obQlGl3Yeuv/htGjcwLnCLHhRgY4BNCqSE8Jc5SWAwHQTyr/umPfy7fMBKmLIg4NAAAAZjBkBgkqhkiG9w0BBwagVzBVAgEAMFAGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMJt3w4Jc69Ywz9+mKAgEQgCPBlo+HwQ9FANHT9fLqAOoTLOCdOQFstfmVZqp7rHN204asBQ=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHj/obQlGl3Yeuv/htGjcwLnCLHhRgY4BNCqSE8Jc5SWAwHQTyr/umPfy7fMBKmLIg4NAAAAZjBkBgkqhkiG9w0BBwagVzBVAgEAMFAGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMJt3w4Jc69Ywz9+mKAgEQgCPBlo+HwQ9FANHT9fLqAOoTLOCdOQFstfmVZqp7rHN204asBQ=="
}

terraform {  
  backend "s3" {
    # todo
    bucket  = "gotcha-dev-terraform-state"
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