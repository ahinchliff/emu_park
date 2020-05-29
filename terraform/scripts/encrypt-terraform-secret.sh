set +o posix
echo -n $1 > tmp
aws kms encrypt \
  --key-id alias/terraform_config \
  --plaintext fileb://tmp \
  --output text --query CiphertextBlob \
  --region eu-west-1
rm tmp
