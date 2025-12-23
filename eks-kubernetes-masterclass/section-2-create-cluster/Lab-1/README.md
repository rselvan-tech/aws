
# EKS Cluster Setup

## What This Does

Creates an EKS cluster with:
- Control Plane (AWS managed)
- 4 worker nodes (t3.small)
- Pre-installed: vpc-cni, kube-proxy, coredns
- Share one IAM role (all pods get same permissions)

## Prerequisites

```bash
# Check you have these installed
aws --version        # AWS CLI
eksctl version       # eksctl (need v0.165.0+)
kubectl version      # kubectl
aws-vault --version  # AWS Vault
```
## Files

- `setup-eks.sh` - Script to create cluster
- `eksctl-config.template.yaml` - Cluster configuration template
- `config.env` - My settings (not in git)
- `config.env.example` - Example settings

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

## Architecture

### Cluster Components
```
EKS Cluster (my-eks)
├── Control Plane (AWS Managed)
├── Managed Node Group (4 x t3.small)
│   ├── kube-proxy (DaemonSet)
│   ├── coredns (Deployment)
│   └── aws-node/vpc-cni (DaemonSet)
└── Default Addons (AWS Managed)
    ├── vpc-cni (networking)
    ├── kube-proxy (network proxy)
    └── coredns (DNS)
```

### IAM Setup
```
Node IAM Role (Full Permissions - Default Setup)
├── AmazonEKSWorkerNodePolicy
├── AmazonEC2ContainerRegistryReadOnly
├── AmazonEKS_CNI_Policy              ⚠️ All pods inherit this
└── (Additional policies as needed)

Console Access
└── IAM User: ${CONSOLE_USER_ARN}
    └── Policy: AmazonEKSClusterAdminPolicy
    └── Scope: Full cluster admin access
```

## Setup

1. **Copy the config file**
   ```bash
   cp config.env.example config.env
   ```

2. **Edit config.env with your IAM user**
   ```bash
   CONSOLE_USER_ARN=arn:aws:iam::YOUR_ACCOUNT:user/YOUR_USERNAME
   ```

3. **Start AWS Vault** (need 12-hour session for cluster creation)
   ```bash
   aws-vault exec admin --duration=12h -- /bin/bash
   ```

4. **Create the cluster**
   ```bash
   chmod +x setup-eks.sh
   ./setup-eks.sh              # Creates cluster named "my-eks"
   ./setup-eks.sh prod-cluster # Or use custom name
   ```


## Verify It Worked

```bash
# Check cluster exists
eksctl get cluster


# See nodes
kubectl get nodes

# Check addons
eksctl get addons --cluster <cluster name>



## Clean Up

```bash
eksctl delete cluster -f eksctl-config.yaml
```