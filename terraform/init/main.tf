provider "aws" {
  region  = var.aws_region
  assume_role {
    role_arn = "arn:aws:iam::${var.aws_account_number}:role/Terraform"
  }
}

resource "aws_kms_key" "terraform_config" {
  description = "Used to encrypt terraform config"
}

resource "aws_kms_alias" "terraform_config" {
  name = "alias/terraform_config"
  target_key_id = aws_kms_key.terraform_config.key_id
}