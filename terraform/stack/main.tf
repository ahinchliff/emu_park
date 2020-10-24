provider "aws" {
  region  = var.aws_region
  assume_role {
    role_arn = "arn:aws:iam::${var.aws_account_number}:role/Terraform"
  }
}

module networking {
  source = "../modules/networking"
  aws_region = var.aws_region
}

module data {
  source = "../modules/data"
  database_name = var.project_name
  subnet_group_name = module.networking.database_subnet_group_name
  security_group_id = module.networking.database_security_group_id
  master_username = var.mysql_master_username
  master_password_encrypted = var.mysql_master_password_encrypted
}

module files {
  source = "../modules/files"
}

module config {
  source = "../modules/config"
  environment = var.environment
  aws_region = var.aws_region
  mysql_application_user_password_encrypted = var.mysql_application_user_password_encrypted
  mysql_application_user_username = var.mysql_application_user_username
  mysql_host = module.data.mysql_address
  mysql_port = module.data.mysql_port
  mysql_database_name = var.project_name
  jwt_issuer = module.auth.users_user_pool_endpoint
  profile_pictures_s3_bucket_domain = module.files.domain_names.profile_pictures
  web_sockets_dynamo_table_name = var.web_sockets_dynamo_table_name
  # web_sockets_endpoint = module.websockets.endpoint
}

module auth {
  source = "../modules/auth"
}

module api {
  source = "../modules/api"
  environment = var.environment
  config_param_arns = [module.config.arns.mysql_application_user_password]
}

# module websockets {
#   source = "../modules/websockets"
#   environment = var.environment
#   dynamo_table_name = var.web_sockets_dynamo_table_name
# }

# module queue_tasks {
#   source = "../modules/queue-tasks"
# }