locals {
  # todo
  project_name = "gotcha"
  # todo
  environment = "development"
  # todo
  region = "eu-west-1"
  # todo
  aws_account_number = "224937332002"
  # todo
  mysql_master_password_encrypted = "AQICAHj/obQlGl3Yeuv/htGjcwLnCLHhRgY4BNCqSE8Jc5SWAwHO6QBKBaAGa3vodt1cgFHQAAAAhzCBhAYJKoZIhvcNAQcGoHcwdQIBADBwBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDG2ZnsnKq1/KGGOyVgIBEIBDP+1IQm2x5w/eRXV1/eMRLxK2ExfhwWy6ocpfkOjo2lO7qnK1VeFfrnxzTByxj+HaZOA83+e+5LRhHwKy861/QBC4IA=="
  # todo
  mysql_application_user_password_encrypted = "AQICAHj/obQlGl3Yeuv/htGjcwLnCLHhRgY4BNCqSE8Jc5SWAwHO6QBKBaAGa3vodt1cgFHQAAAAhzCBhAYJKoZIhvcNAQcGoHcwdQIBADBwBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDG2ZnsnKq1/KGGOyVgIBEIBDP+1IQm2x5w/eRXV1/eMRLxK2ExfhwWy6ocpfkOjo2lO7qnK1VeFfrnxzTByxj+HaZOA83+e+5LRhHwKy861/QBC4IA=="
  # todo
  jwt_secret = "AQICAHj/obQlGl3Yeuv/htGjcwLnCLHhRgY4BNCqSE8Jc5SWAwEV6lfaYE1V1b+e1TGvyxRIAAAAaTBnBgkqhkiG9w0BBwagWjBYAgEAMFMGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMv+k8GIGqXq47eksOAgEQgCb+T18m7Fk2swTOyp/ivceBEsHCW2jzEG9pJhe8FWJdTvxWBXlL9w=="
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
  jwt_secret = local.jwt_secret
}