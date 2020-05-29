data "aws_kms_secrets" "data" {
  secret {
    name    = "mysql_master_password"
    payload = var.mysql_master_password_encrypted
  }
}

resource "aws_db_instance" "db" {
  allocated_storage    = 10
  storage_type         = "gp2"
  engine               = "mysql"  
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  username             = "root"
  password             = data.aws_kms_secrets.data.plaintext["mysql_master_password"]
  parameter_group_name = "default.mysql5.7"
  apply_immediately    = true
  skip_final_snapshot  = true
  publicly_accessible  = true
  db_subnet_group_name = var.database_subnet_group_name
  vpc_security_group_ids = [var.database_security_group_id]
  
  tags = {
    Name = "Database"
  }
}