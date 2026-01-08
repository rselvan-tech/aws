import { ListQueuesCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from './sqs-client.js';

export const run = async () => {
    try {
        const response = await sqsClient.send(new ListQueuesCommand({}));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
