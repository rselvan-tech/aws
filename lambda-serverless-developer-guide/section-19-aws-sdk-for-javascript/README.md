Below is the **exact step-by-step way to run your code from VS Code**.

* * *

## ✅ What This Code Is

Your code uses **AWS SDK for JavaScript v3** to:

- Authenticate using your **aws-vault CLI credentials**
    
- Call **Amazon S3**
    
- List all S3 buckets in your account
    

It runs **locally on your machine**.

* * *

## 🧩 Step 1: Create a Node.js Project

In VS Code:

1.  Open a new empty folder
    
2.  Open **Terminal** in VS Code
    
3.  Run:
    

`npm init -y`

This creates `package.json`.

* * *

## 📦 Step 2: Install AWS SDK v3 (S3)

Run:

`npm install @aws-sdk/client-s3`

* * *

## 📝 Step 3: Enable ES Modules (IMPORTANT)

Your code uses `import`, so Node.js must know this.

Open **package.json** and add:

`{ "type": "module"}`

Your `package.json` should look like:

```
{
  "name": "aws-s3-test",
  "version": "1.0.0",
  "type": "module"
}

```

* * *

## 🧪 Step 4: Create the Script File

Create a file named:

`listBuckets.js`

Paste **this exact working code**:

```
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "us-east-1"
});

async function listBuckets() {
  const response = await client.send(
    new ListBucketsCommand({})
  );
  console.log(response.Buckets);
}

listBuckets();

```

* * *

## 🔐 Step 5: Confirm AWS Credentials Are Available

In your terminal, run:

`aws-vault exec admin -- aws sts get-caller-identity`

If you see your AWS Account ID → credentials are working ✅

* * *

## ▶️ Step 6: Run the Code

From the VS Code terminal:

`aws-vault exec admin -- aws sts get-caller-identity`

### ✅ Expected Output

```
[
  { "Name": "my-first-bucket", "CreationDate": "2023-10-01T10:20:30.000Z" },
  { "Name": "project-files", "CreationDate": "2024-01-15T08:12:10.000Z" }
]

```

## 🧠 What You Learned

✔ Running AWS SDK code locally  
✔ Using AWS credentials securely  
✔ Node.js + AWS SDK v3 setup  
✔ Real AWS service call from VS Code