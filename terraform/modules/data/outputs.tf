output "mysql_address" {
  value = aws_db_instance.db.address
}

output "mysql_port" {
  value = aws_db_instance.db.port
}