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

## 🔐 Step 4: Confirm AWS Credentials Are Available

In your terminal, run:

`aws-vault exec admin -- aws sts get-caller-identity`

If you see your AWS Account ID → credentials are working ✅

* * *

## 🧪 Step 5: Create s3Client object

Create a file named:

`s3Client.js`

Paste **this exact working code**:

```
import { S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client();
export { s3Client };

```

* * *
## 🧪 Step 6: List S3 Buckets

Create a file named:

`listbuckets.js`

Paste **this exact working code**:

```
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

export const list = async () => {
    try {
      const data= await s3Client.send(new ListBucketsCommand({}));
      console.log("Success", data.Buckets);
    } catch (error){
        console.log("Error:",error);
    }
};
list();

```

* * *


## ▶️ Step 7: Run the Code

From the VS Code terminal:

`aws-vault exec admin -- node listbuckets.js`

### ✅ Expected Output

```
Success [
  {
    Name: 'codepipeline-us-east-1-484bde4a0ee2-4eca-be19-93178af855fc',
    CreationDate: 2025-12-07T21:36:09.000Z,
    BucketArn: 'arn:aws:s3:::codepipeline-us-east-1-484bde4a0ee2-4eca-be19-93178af855fc'
  }
]

```

* * *

## 🧪 Step 8: Create S3 Bucket

Create a file named:

`createbucket.js`

Paste **this exact working code**:

```
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

const input = {
    Bucket: "urdrdrd-new-bucket-from-sdk"
};

export const create = async () => {
    try {
      const output= await s3Client.send(new CreateBucketCommand(input));
      console.log("Success : ", output.Location );
    } catch (error){
        console.log("Error:",error);
    }
};
create();

```

* * *
## ▶️ Step 9: Run the Code

From the VS Code terminal:

`aws-vault exec admin -- node listbuckets.js`

### ✅ Expected Output

```
Success :  http://urdrdrd-new-bucket-from-sdk.s3.amazonaws.com/

```

* * *
## 🧪 Step 10: Uploading a File to a S3 Bucket

Create a file named:

`uploadobject.js`

Paste **this exact working code**:

```
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";
import {fs} from "file-system";

const file = "./index.html";
const fileStream = fs.createReadStream(file);

const params = {
    Bucket: "urdrdrd-new-bucket-from-sdk",
    Key: "index.html",
    Body: fileStream
};

export const upload = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Success", data);
  } catch (error) {
    console.log("Error", error);
  }
};
upload();

```

* * *
## ▶️ Step 11: Run the Code

From the VS Code terminal:

Run:

`npm install file-system`


`aws-vault exec admin -- node uploadobject.js`

### ✅ Expected Output

```
Success {
  ETag: '"7950236afd122626a900e9cf42a64db1"',
  ChecksumCRC32: '/hL7Eg==',
  ChecksumType: 'FULL_OBJECT',
  ServerSideEncryption: 'AES256',
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'GC0TJZ7V3T8A4D53',
    extendedRequestId: 'uii4Zh8fE3CCzlqu6b3HUQMNK1X4Yj3xTR7KISkm3b5RqGFe+PawS9Ir+Q5Dx6P0Lg4IDocX4kRzaDBinCjs66ADgA7JgAQ21Q88I8MVxJk=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}

```

* * *

## 🧪 Step 13: Delete a S3 Bucket

Create a file named:

`deletebucket.js`

Paste **this exact working code**:

```
import { DeleteBucketCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

const input = {
    Bucket: "urdrdrd-new-bucket-from-sdk"
};

export const deleteS3 = async () => {
    try {
      const output= await s3Client.send(new DeleteBucketCommand(input));
      console.log("Success : ", output );
    } catch (error){
        console.log("Error:",error);
    }
};
deleteS3();

```

* * *
## ▶️ Step 11: Run the Code

in AWS Managment console :

Make the bucket empty.Remove if any files exist

From the VS Code terminal:

Run:

`aws-vault exec admin -- node deletebucket.js`

### ✅ Expected Output

```
Success :  {
  '$metadata': {
    httpStatusCode: 204,
    requestId: 'XATP2XDH9JTH3GZE',
    extendedRequestId: '2E1RWani2JyuZPRCNmKguOWngX08G7NoH1LSUbmruRd1AZG/1NPCpwL0igh5eP/GcIoqxs2SX5mttauJChoNqUqJoLBxljV1G8ovdfshqUo=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  }
}

```

* * *
## 🧠 What You Learned

✔ Running AWS SDK code locally  
✔ Using AWS credentials securely  
✔ Node.js + AWS SDK v3 setup  
✔ List S3 buckets using S3 SDK
✔ Create S3 bucket using S3 SDK
✔ Uploading a file to S3 bucket using S3 SDK
✔ Delete S3 bucket using S3 SDK
