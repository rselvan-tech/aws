import { DeleteQueueCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from './sqs-client.js';

const input = {
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/308360398142/new-queue'
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new DeleteQueueCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
