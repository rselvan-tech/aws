import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from './sqs-client.js';

const input = {
    QueueName: 'demo-queue',
    Attributes: {
        DelaySeconds: '60',
        MessageRetentionPeriod: '86400'
    }
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new CreateQueueCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
