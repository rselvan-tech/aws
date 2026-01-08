import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from './sqs-client.js';

const queueURL = 'https://sqs.us-east-2.amazonaws.com/308360398142/new-queue';

const input = {
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0,
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ['All']
};

export const run = async () => {
    try {
        const response = await sqsClient.send(new ReceiveMessageCommand(input));
        // put your business logic

        if (response.Messages) {
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle,
            };
            try {
                const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
                console.log('Message deleted', data);
            } catch (err) {
                console.log('Error :', err);
            }
        } else {
            console.log('No messages to delete');
        }

        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
