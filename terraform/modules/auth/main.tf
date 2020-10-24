resource "aws_cognito_user_pool" "users" {
  name = "users"
  username_attributes = [
    "email"
  ]

  username_configuration {
    case_sensitive = false
  }

  auto_verified_attributes = [
    "email"
  ]

  schema {
    name                     = "userId"
    attribute_data_type      = "Number"
    required                 = false
    developer_only_attribute = false
    mutable                  = true
    number_attribute_constraints { 
      min_value                = "1"
      max_value                = "2147483647"
    }
  }
}

resource "aws_cognito_user_pool_client" "web" {
  name                                 = "web"
  user_pool_id                         = aws_cognito_user_pool.users.id
  prevent_user_existence_errors        = "ENABLED"
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "openid",
    "email",
  ]
  supported_identity_providers = [
    "COGNITO",
  ]
  
  allowed_oauth_flows = [
    "implicit",
  ]

  explicit_auth_flows = [
    "USER_PASSWORD_AUTH"
  ]
  
  callback_urls = [ 
    "http://localhost:3000/login-callback",
  ]

  default_redirect_uri = "http://localhost:3000/login-callback"
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "terraform"
  user_pool_id = aws_cognito_user_pool.users.id
}

# module email_verification_email_customisation_lambda {
#   source = "../shared/lambda"
#   name = "email-verification-email-customisation"
#   source_file = "../../../.webpack/email-verification-email-customisation.js"
# }