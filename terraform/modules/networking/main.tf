resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default"
  }
  enable_dns_support   = true
  enable_dns_hostnames = true
}

data "aws_internet_gateway" "default" {
  filter {
    name   = "attachment.vpc-id"
    values = [aws_default_vpc.default.id]
  }
}

resource "aws_default_route_table" "default_private" {
  default_route_table_id = aws_default_vpc.default.default_route_table_id
  tags = {
    Name = "Default Private"
  }
}

resource "aws_default_subnet" "default_private_a" {
  availability_zone = "${var.aws_region}a"
  tags = {
    Name = "Default Private A"
  }
}

resource "aws_default_subnet" "default_private_b" {
  availability_zone = "${var.aws_region}b"
  tags = {
    Name = "Default Private B"
  }
}

resource "aws_default_subnet" "default_private_c" {
  availability_zone = "${var.aws_region}c"
  tags = {
    Name = "Default Private C"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_default_vpc.default.id
  tags = {
    Name = "Public"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = data.aws_internet_gateway.default.id
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_network_acl" "public" {
  vpc_id = aws_default_vpc.default.id
  tags = {
    Name = "Public"
  }

   subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
  ]

  ingress {
    protocol   = "tcp"
    rule_no    = 1
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 3306
    to_port    = 3306
  }

  egress {
    protocol   = -1
    rule_no    = 1
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }
}

resource "aws_subnet" "public_a" {
  vpc_id = aws_default_vpc.default.id
  availability_zone = "${var.aws_region}a"
  cidr_block = "172.31.48.0/24"
  tags = {
    Name = "Public A"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id = aws_default_vpc.default.id
  availability_zone = "${var.aws_region}b"
  cidr_block = "172.31.64.0/24"
  tags = {
    Name = "Public B"
  }
}

resource "aws_db_subnet_group" "public" {
  name = "public"
  subnet_ids = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
  ]
}
