locals {
  # todo
  project_name = "gotcha"
  # todo
  environment = "development"
  # todo
  region = "ap-southeast-2"
  # todo
  aws_account_number = "224937332002"
  # todo
  mysql_master_password_encrypted = "AQICAHh1yrp9pQ939j23jnVrLa9GjU8dG0hGQF34Tdco2Ue+owFcFUM0Y1F1ztUcaAvTfv74AAAAhzCBhAYJKoZIhvcNAQcGoHcwdQIBADBwBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDLwXLwvpX04MUBIITgIBEIBDn+rpu/eM8e8zIzVB7I/FI8gxD5Npk/g2kYTewlgFyHmdzcvpgjDMz+onGvTNfMtlfFcx2erNExO2+XNnjru1RZXsBw=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHh1yrp9pQ939j23jnVrLa9GjU8dG0hGQF34Tdco2Ue+owFcFUM0Y1F1ztUcaAvTfv74AAAAhzCBhAYJKoZIhvcNAQcGoHcwdQIBADBwBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDLwXLwvpX04MUBIITgIBEIBDn+rpu/eM8e8zIzVB7I/FI8gxD5Npk/g2kYTewlgFyHmdzcvpgjDMz+onGvTNfMtlfFcx2erNExO2+XNnjru1RZXsBw=="
  # todo
  jwt_secret = "AQICAHh1yrp9pQ939j23jnVrLa9GjU8dG0hGQF34Tdco2Ue+owHmQz25O4pU8qg4723PQuY4AAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMPDNGWT6Zxqdsbr21AgEQgCa7P6zNaiE+tX15WHi6+hakpcseF1V4y+EmrgVXiwkJmytN5h7TCQ=="

}

terraform {  
  backend "s3" {
    bucket  = "gotcha-development-terraform-state"
    encrypt = true
    key     = "terraform.tfstate"
    region  = "ap-southeast-2"
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
  jwt_secret = local.jwt_secret
}