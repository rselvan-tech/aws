import { SubscribeCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

const input = {
    Token: 'xxxxxxxxx',
    TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic',
    AuthenticateOnUnsubscribe: 'true'
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
