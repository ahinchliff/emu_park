resource "aws_s3_bucket" "profile_pictures" {
  bucket = "lambda-terraform-profile-pictures"
  acl    = "private"
}