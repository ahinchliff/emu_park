set +o posix
aws kms decrypt \
  --ciphertext-blob fileb://<(echo $1 | base64 -D) \
  --region ap-southeast-2 \
  --output text --query Plaintext | base64 -D
