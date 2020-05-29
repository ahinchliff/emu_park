set +o posix
aws kms decrypt \
  --ciphertext-blob fileb://<(echo $1 | base64 -D) \
  --region eu-west-1 \
  --output text --query Plaintext | base64 -D
