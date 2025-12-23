# **Hands-On Lab: Using IRSA in AWS EKS**

### **Prerequisites**

- AWS CLI configured with admin access
    
- `eksctl` installed
    
- kubectl installed and configured
    
- An existing EKS cluster (v1.26+) in a region
    

* * *

## **Step 1: Verify/Create OIDC Provider for your Cluster**

1.  **Check if your cluster already has an EKS OIDC Issuer:**

```
aws eks describe-cluster --name my-cluster --query "cluster.identity.oidc.issuer"

```

- output mostly not  empty →  OIDC Issuer
    - **EKS OIDC Issuer ≠ IAM OIDC Provider**: Your cluster has an OIDC issuer URL (which EKS creates automatically for every cluster), but there's no corresponding IAM OIDC provider created.
        
    - **EKS Always Creates OIDC Issuer**: Every EKS cluster automatically gets an OIDC issuer endpoint - this is standard EKS behavior and has been for a long time. This is what you're seeing in the `describe-cluster` output.
        
    - **IAM OIDC Provider is Separate**: The IAM OIDC provider (which you need for IRSA - IAM Roles for Service Accounts) is a separate AWS IAM resource that must be explicitly created.
        

2.  ****Check if your cluster already has an** IAM OIDC provider:**

```
aws iam list-open-id-connect-providers

```

2.  **Create/associate OIDC provider (if not exists):**

```
eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster my-cluster \
  --approve

```

- This creates an **IAM OIDC provider** pointing to your cluster issuer URL.

* * *

## **Step 2: Create IAM Role with Trust Policy for IRSA**

1.  **Save the IAM Trust Policy as `irsa-trust-policy.json`:**

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS Account ID>:<OpenID Connect provider URL from step:1.1.Remove 'https://' from URL>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "<OpenID Connect provider URL from step:1.1.Remove 'https://' from URL>:sub": "system:serviceaccount:default:s3-reader",
          "<OpenID Connect provider URL from step:1.1.Remove 'https://' from URL>:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}

```

2.  **Create the IAM Role:**

```
aws iam create-role \
  --role-name S3ReaderRole \
  --assume-role-policy-document file://irsa-trust-policy.json

```

3.  **Attach AWS managed policy or custom policy:**

```
aws iam attach-role-policy \
  --role-name S3ReaderRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

```


* * *

## **Step 3: Create a Kubernetes ServiceAccount with Role Annotation**

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: s3-reader
  namespace: default
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<AWS_ACCOUNT_ID>:role/S3ReaderRole #IAM Role created in step:2.2

```

`kubectl apply -f sa.yaml`

- The **annotation connects the SA to the IAM role**.
    
- AWS IRSA webhook will detect it and inject AWS env vars + projected token.
    

* * *

## **Step 4: Create a Pod Using the ServiceAccount**

```
apiVersion: v1
kind: Pod
metadata:
  name: s3-reader-pod
  namespace: default
spec:
  serviceAccountName: s3-reader
  containers:
    - name: app
      image: amazonlinux
      command: ["sleep", "3600"]

```

```
kubectl apply -f pod.yaml

```

* * *

## **Step 5: Verify AWS Env Variables in Pod**

1.  Enter the pod:

```
kubectl exec -it s3-reader-pod -- bash

```

2.  Check environment variables:

```
echo $AWS_ROLE_ARN
echo $AWS_WEB_IDENTITY_TOKEN_FILE

```

- These were injected by the **EKS IRSA mutating webhook**.

* * *

## **Step 6: Test AWS Credentials Using AWS CLI**

1.  Install AWS CLI (Amazon Linux container already has v2 available):

```
yum install -y awscli

```

2.  Run AWS CLI command using IRSA credentials:

```
aws s3 ls --region us-east-1

```

- It should succeed with **read-only access** if the IAM role policy is correct.

* * *

## **Step 7: Inspect the ServiceAccount JWT Token**

1.  View token mounted in pod:

```
cat $AWS_WEB_IDENTITY_TOKEN_FILE

```

- It’s a **JWT token**, signed by Kubernetes API server.
    
- Contains claims like:
    

```
{
  "iss": "https://oidc.eks.us-east-1.amazonaws.com/id/CLUSTER_ID",
  "sub": "system:serviceaccount:default:s3-reader",
  "aud": "sts.amazonaws.com",
  "exp": <expiry>,
  "iat": <issued_at>
}

```

2.  Decode JWT (optional, outside pod):

```
jwt decode <token>

```

* * *

## **Step 8: Observe the Full Flow (Behind-the-Scenes)**

1.  **Kubernetes API server** → issues JWT token for SA
    
2.  **AWS IRSA webhook** → injects token + AWS_ROLE_ARN into pod
    
3.  **Pod** → AWS SDK uses token + role ARN → `AssumeRoleWithWebIdentity`
    
4.  **AWS STS** → validates JWT against OIDC issuer + IAM trust policy
    
5.  **STS** → returns temporary AWS credentials → Pod uses to access AWS services
    

* * *

## **Step 9: Cleanup Lab Resources**

```
kubectl delete pod s3-reader-pod
kubectl delete sa s3-reader
aws iam detach-role-policy --role-name S3ReaderRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
aws iam delete-role --role-name S3ReaderRole

```

- Remove IAM OIDC provider if desired:

```
aws iam delete-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/CLUSTER_ID

```

* * *

### ✅ **Key Learning Outcomes**

- Understand **OIDC and JWT in Kubernetes**.
    
- Understand **IAM OIDC provider registration**.
    
- Learn how **IAM Role trust policy is created and validated**.
    
- Connect **ServiceAccount annotations** to **IAM roles** via IRSA.
    
- Observe **IRSA runtime workflow**: Pod → AWS SDK → STS → AWS service.
    
- Inspect **projected JWT token** issued by Kubernetes API server.