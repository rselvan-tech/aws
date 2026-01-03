## Lab Description : Learn to install AWS Load Balancer Controller

## Introduction

1.  Create IAM Policy and make a note of Policy ARN
2.  Create IAM Role and k8s Service Account and bound them together
3.  Install AWS Load Balancer Controller using HELM3 CLI
4.  Create a default Ingress Class

&nbsp;

![Lab](images/lab.png)

* * *

* * *

### <ins>Section-1 : Pre-requisite</ins>

### 1 : Check Command Line Utilities : eksctl, kubectl & helm

```
# Check you have these installed
aws --version        # AWS CLI
eksctl version       # eksctl (need v0.165.0+)
kubectl version      # kubectl
aws-vault --version  # AWS Vault
helm version         # Helm


```

### 2: Create EKS Cluster & IAM OIDC provider

```
# Copy the config file
cp config.env.example config.env

# Edit config.env with your IAM user
CONSOLE_USER_ARN=arn:aws:iam::YOUR_ACCOUNT:user/YOUR_USERNAME

# Start AWS Vault (need 12-hour session for cluster creation)
aws-vault exec admin --duration=12h -- /bin/bash

# Create the cluster
chmod +x setup-eks.sh
./setup-eks.sh              # Creates cluster named "my-eks"
./setup-eks.sh prod-cluster # Or use custom name

# Create IAM OIDC provider
eksctl utils associate-iam-oidc-provider \
--region {{REGION}} \
--cluster {{CLUSTER NAME}} \
--approve

```

### 3: Verify Cluster, Node Groups

```
# Verfy EKS Cluster
eksctl get cluster

# Verify EKS Node Groups
eksctl get nodegroup --cluster={{CLUSTER NAME}}

# Verify if any IAM Service Accounts present in EKS Cluster
eksctl get iamserviceaccount --cluster={{CLUSTER NAME}}
Observation: No k8s Service accounts as of now.


# Verify EKS Nodes in EKS Cluster using kubectl
kubectl get nodes

# Verify using AWS Management Console
1. EKS EC2 Nodes (Verify Subnet in Networking Tab)
2. EKS Cluster
```

* * *

### <ins>Section-2 : Create IAM Policy & Role</ins>

&nbsp;

- Create IAM Policy. Note down the ARN
    - use policy document from the project's github page
    - https://github.com/kubernetes-sigs/aws-load-balancer-controller/tree/main/docs/install
- Create an IAM role and Kubernetes `ServiceAccount` for the LBC. Use the ARN from the previous step.

&nbsp;

```
# Download latest IAM Policy file from LBC project github
curl -o lbc_iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json

# Create IAM Policy using policy downloaded
aws iam create-policy \
    --policy-name LBCIAMPolicy \
    --policy-document file://lbc_iam_policy.json

# Note down Policy ARN from above command and use the same below

# Create IAM Role and Service Account.Connect the sa to Role using annotation
eksctl create iamserviceaccount \
  --cluster={{CLUSTER NAME}} \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn={{POLICY ARN}} \
  --override-existing-serviceaccounts \
  --approve

# Verification
# Get IAM Service Account
eksctl  get iamserviceaccount --cluster eksdemo1
kubectl get sa aws-load-balancer-controller -n kube-system
```

* * *

&nbsp;

### <ins><ins>Section-3 :</ins> Install AWS LBC using helm</ins>

&nbsp;

```
# Add the eks-charts repository.
helm repo add eks https://aws.github.io/eks-charts

# Update your local repo to make sure that you have the most recent charts.
helm repo update


## Replace Cluster Name, Region Code, VPC ID

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName={{CLUSTER NAME}} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region={{REGION}} \
  --set vpcId={{VPC ID}} \
  --set image.repository=public.ecr.aws/eks/aws-load-balancer-controller \
  --set enableShield=false \
  --set enableWaf=false \
  --set enableWafv2=false

# --set enableShield=false \          # Disable AWS Shield (costs money)
# --set enableWaf=false \              # Disable WAF integration
# --set enableWafv2=false \            # Disable WAFv2 integration
# --set replicaCount=2                 # High availability
```


### <ins><ins><ins>Section-4 :</ins></ins> Verify that the controller is installed and Webhook Service created</ins>

```
# Verify that the controller is installed.
kubectl -n kube-system get deployment aws-load-balancer-controller


# Verify AWS Load Balancer Controller Webhook service created
kubectl -n kube-system get svc aws-load-balancer-webhook-service


# Verify Labels in Service and Selector Labels in Deployment
kubectl -n kube-system get svc aws-load-balancer-webhook-service -o yaml
kubectl -n kube-system get deployment aws-load-balancer-controller -o yaml
Observation:
1. Verify "spec.selector" label in "aws-load-balancer-webhook-service"
2. Compare it with "aws-load-balancer-controller" Deployment "spec.selector.matchLabels"
3. Both values should be same which traffic coming to "aws-load-balancer-webhook-service" on port 443 will be sent to port 9443 on "aws-load-balancer-controller" deployment related pods.
```

&nbsp;

### <ins><ins><ins>Section-5 :</ins></ins> Create default Ingress class for ALB/LBC</ins>

```
#ingress-class.yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: my-aws-ingress-class
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: ingress.k8s.aws/alb

#Create ingress class
kubectl apply -f ingress-class.yaml

```

&nbsp;

\## Additional Note  
\# 1. You can mark a particular IngressClass as the default for your cluster.  
\# 2. Setting the ingressclass.kubernetes.io/is-default-class annotation to true on an IngressClass resource will ensure that new Ingress resources without an spec.ingressClassName field specified will be assigned this default IngressClass.
