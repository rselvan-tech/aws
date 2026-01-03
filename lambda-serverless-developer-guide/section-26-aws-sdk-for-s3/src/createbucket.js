import { CreateBucketCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client.js';

const input = {
    Bucket: 'urdrdrd-new-bucket-from-sdk'
};

export const create = async () => {
    try {
      const output= await s3Client.send(new CreateBucketCommand(input));
      console.log('Success : ', output.Location );
    } catch (error){
        console.log('Error:',error);
    }
};
create();
