import { SubscribeCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

const input = {
    Protocol: 'email',
    TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic',
    Endpoint: 'relabos612@dubokutv.com'
};

export const run = async () => {
    try {
        const response = await snsClient.send(new SubscribeCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
