
# EKS Cluster Setup

## Prerequisites
- AWS Vault configured
- eksctl installed

## Assumptions

This setup is designed for the following scenario:

- **AWS Vault Role**: You use AWS Vault with an **admin role** to execute CLI commands (aws, eksctl)
- **Console User**: You use a separate **IAM user** (e.g., `abcdefgh`) to access the AWS Management Console
- **Access Grant**: The script grants the console user admin access to the EKS cluster, so you can view and manage it from the AWS Console

**Why this matters:**
- The cluster is created by the AWS Vault role
- By default, only the creator (the role) has access to the cluster
- The `accessEntries` configuration grants your console user access to the cluster
- This allows you to manage the cluster from both CLI (via AWS Vault) and Console (via IAM user)

**If your setup is different:**
- If you use the same identity for both CLI and Console, you can remove the `accessConfig` section
- If you want to grant access to additional users/roles, add more entries to `accessEntries`

## Setup

1. Copy and configure environment file:
```bash
   cp config.env.example config.env
   # Edit config.env with your console user ARN
```

2. Run with AWS Vault:
```bash
   chmod +x setup-eks.sh
   aws-vault exec your-profile -- ./setup-eks.sh [CLUSTER_NAME] [AWS_REGION]
```

## Examples
```bash
# Use defaults (my-eks, region from AWS profile)
aws-vault exec your-profile -- ./setup-eks.sh

# Custom cluster name
aws-vault exec your-profile -- ./setup-eks.sh prod-cluster

# Custom cluster name and region
aws-vault exec your-profile -- ./setup-eks.sh prod-cluster us-west-2