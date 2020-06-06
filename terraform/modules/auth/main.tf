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