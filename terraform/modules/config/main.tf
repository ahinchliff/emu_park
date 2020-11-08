module "environment" {
  source = "../shared/config-param"
  name = "environment"
  value = var.environment
  sensitive = false
}

module "region" {
  source = "../shared/config-param"
  name = "region"
  value = var.aws_region
  sensitive = false
}

module "mysql_host" {
  source = "../shared/config-param"
  name = "mysql_host"
  value = var.mysql_host
  sensitive = false
}

module "mysql_port" {
  source = "../shared/config-param"
  name = "mysql_port"
  value = var.mysql_port
  sensitive = false
}

module "mysql_database_name" {
  source = "../shared/config-param"
  name = "mysql_database_name"
  value = var.mysql_database_name
  sensitive = false
}

module "mysql_application_user_username" {
  source = "../shared/config-param"
  name = "mysql_application_user_username"
  value = var.mysql_application_user_username
  sensitive = false
}

# module "profile_pictures_s3_bucket_domain" {
#   source = "../shared/config-param"
#   name = "profile_pictures_s3_bucket_domain"
#   value = var.profile_pictures_s3_bucket_domain
#   sensitive = false
# }

module "web_sockets_dynamo_table_name" {
  source = "../shared/config-param"
  name = "web_sockets_dynamo_table_name"
  value = var.web_sockets_dynamo_table_name
  sensitive = false
}

# module "web_sockets_endpoint" {
#   source = "../shared/config-param"
#   name = "web_sockets_endpoint"
#   value = var.web_sockets_endpoint
#   sensitive = false
# }

# module "jwt_issuer" {
#   source = "../shared/config-param"
#   name = "jwt_issuer"
#   value = var.jwt_issuer
#   sensitive = false
# }

module "mysql_application_user_password" {
  source = "../shared/config-param"
  name = "mysql_application_user_password"
  value = var.mysql_application_user_password_encrypted
  sensitive = true
}

module "jwt_secret" {
  source = "../shared/config-param"
  name = "jwt_secret"
  value = var.jwt_secret
  sensitive = true
}

