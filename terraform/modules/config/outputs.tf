  output "arns" {
    value = {
      "mysql_application_user_password" = module.mysql_application_user_password.arn
      "jwt_secret" = module.jwt_secret.arn
    }
    
  }