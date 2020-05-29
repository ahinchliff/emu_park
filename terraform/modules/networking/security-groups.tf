resource aws_security_group database {
  name        = "database"
  description = "Control database traffic"
  vpc_id      = aws_default_vpc.default.id
}

resource aws_security_group_rule database_allow_external_access {
  security_group_id = aws_security_group.database.id
  type              = "ingress"
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}