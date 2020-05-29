resource "aws_iam_role_policy" "can_access_non_sensitive_params" {
  name   = "${var.resource_name}_can_access_non_senstive_params"
  role   = var.resource_role_id
  policy = data.aws_iam_policy_document.non_sensitive_policy_document.json
}

data "aws_iam_policy_document" "non_sensitive_policy_document" {
  statement {
    actions = [
      "ssm:GetParameters",
    ]
    resources = ["*"]
    condition {
      test = "StringLike"
      variable = "ssm:resourceTag/sensitive"
      values = [
        "false"
      ]
    }
  }
}

resource "aws_iam_role_policy" "can_access_sensitive_params" {
  count = length(var.param_arns)
  name   = "${var.resource_name}_can_access_senstive_params"
  role   = var.resource_role_id
  policy = data.aws_iam_policy_document.sensitive_policy_document.json
}

data "aws_iam_policy_document" "sensitive_policy_document" {
  statement {
    actions = [
      "ssm:GetParameters",
    ]
    resources = var.param_arns
  }
}