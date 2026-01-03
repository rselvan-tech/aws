import { S3Client } from '@aws-sdk/client-s3';
//const REGION = "us-east-2";
//const ddbClient = new DynamoDBClient({ region: REGION });
const s3Client = new S3Client();
export { s3Client };
