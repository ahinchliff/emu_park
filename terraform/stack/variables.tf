variable environment {}
variable project_name {}
variable aws_account_number {}
variable aws_region {}
variable mysql_master_password_encrypted {}
variable mysql_application_user_password_encrypted {}
variable jwt_secret {}

// optionals

variable mysql_master_username {
  default = "root"
}

variable mysql_application_user_username {
  default = "application"
}

variable web_sockets_dynamo_table_name {
  default = "socketRoomSubscriptions"
}
