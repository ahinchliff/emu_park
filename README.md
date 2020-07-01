# Infrastructure

- Each environment has its own AWS account.
- The following steps need to be completed for each environment (dev, staging, production)
- aws-vault is used to store and execute commands using aws api credentials in your local keychain.

## Setup

### AWS account

1. Create an AWS account (https://portal.aws.amazon.com/billing/signup#/start). Email must be unique to AWS but credit card and phone number can be the same as previous accounts. Signin using the root user.

2. Create an account alias (https://console.aws.amazon.com/iam/home#/home).

3. Create an IAM user (https://console.aws.amazon.com/iam/home?#/users$new?step=details). Set the username to any email (only had to be unique to this AWS account) and enable `Programmatic access` & `AWS Management Console access`. Under permissions, select `Attach existing policies directly` and select `AdministratorAccess`.

4. Create a role for Terraform (https://console.aws.amazon.com/iam/home?#/roles$new?step=type&roleType=crossAccount). Select `Another AWS account` and enter the current accounts id. Under policy select `AdministratorAccess`. This will give Terraform the same access as your user.

### Local AWS access

1. When logging into the newly created user, Select IAM user. For account ID enter the alias created above. Navigate to your IAM user.
2. Under `security crendentials` create a new access key. Delete any existing.
3. Run `aws-vault add [project-name]-[environment]` and follow the prompts.
4. In `~/.zprofile` create an alias to easily run terraform with your credentials. Eg `alias terraform-[projectname]='aws-vault exec [project-name] -- terraform'`
5. Start a new terminal sessions.

### Deployment

- Environment variables including secrets are committed to git.
- To keep secrets secure we encrypt them using a key from AWS KMS.
- Before we can deploy infrastructure that requires a secret (such as the SQL database) we must create a KMS key.

1. In `./package.json` replace `[aws-vault-profile]` with the name of the profile you entered in step 3 of `Local AWS access`
2. In `terraform/[environment]/main.tf` set the region and AWS account id.
3. Create an s3 bucket for the terraform state using the aws cli. `aws-vault exec [profile] -- aws s3api create-bucket --bucket "[project-name]-terraform-state" --region "[region" --create-bucket-configuration LocationConstraint="[region]"`
4. Run `yarn deploy` to create the KMS key used to encrypt sensitive config.
5. Uncomment the modules and outputs in `terraform/[environment]/main.tf`
6. Create strong passwords for the root and application mysql users. Encrypt these using and `yarn encrypt-config [password]` and copy the result into the local variables at the top of ``terraform/[environment]/main.tf`.
7. In `terraform/main/main.tf` set the name of the database.
8. Run `yarn deploy` to deploy the rest of the infrastructure.

## Pulldown

1. Empty all files from all S3 buckets except the bucket used for the terraform state!!!
2. Run `yarn destory`
3. If deploying the infrastructure again you will need to start at step 4.
