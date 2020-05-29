data "aws_kms_secrets" "param" {
  count = var.sensitive == true ? 1 : 0
  secret {
    name = var.name
    payload = var.value
  }
}


resource "aws_ssm_parameter" "param" {
  name = var.name
  type = var.sensitive == true ? "SecureString" : "String"
  value = var.sensitive == true ? data.aws_kms_secrets.param[0].plaintext[var.name] : var.value
  overwrite = true
  tags = {
    sensitive: var.sensitive
  }
}