import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-1'
});

async function listBuckets() {
  const response = await client.send(
    new ListBucketsCommand({})
  );
  console.log(response.Buckets);
}

listBuckets();
