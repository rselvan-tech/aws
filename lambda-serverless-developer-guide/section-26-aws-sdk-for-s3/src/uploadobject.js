import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client.js';
import {fs} from 'file-system';

const file = './index.html';
const fileStream = fs.createReadStream(file);

const params = {
    Bucket: 'urdrdrd-new-bucket-from-sdk',
    Key: 'index.html',
    Body: fileStream
};

export const upload = async () => {
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log('Success', data);
  } catch (error) {
    console.log('Error', error);
  }
};
upload();
