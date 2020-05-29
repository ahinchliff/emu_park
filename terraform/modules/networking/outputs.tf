output "database_security_group_id" {
  value = aws_security_group.database.id
}

output "database_subnet_group_name" {
  value = aws_db_subnet_group.public.name
}