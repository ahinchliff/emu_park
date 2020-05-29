  output "domain_names" {
    value = {
      "profile_pictures" = aws_s3_bucket.profile_pictures.bucket_domain_name
    }
  }