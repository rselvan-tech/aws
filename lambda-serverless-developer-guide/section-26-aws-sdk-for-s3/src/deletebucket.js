import { DeleteBucketCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client.js';

const input = {
    Bucket: 'urdrdrd-new-bucket-from-sdk'
};

export const deleteS3 = async () => {
    try {
      const output= await s3Client.send(new DeleteBucketCommand(input));
      console.log('Success : ', output );
    } catch (error){
        console.log('Error:',error);
    }
};
deleteS3();
