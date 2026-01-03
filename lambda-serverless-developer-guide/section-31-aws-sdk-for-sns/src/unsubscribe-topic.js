import { UnsubscribeCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

const input = {
    SubscriptionArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic:d3a2e88e-2cf1-46d2-9d54-2db478e54207'
};

export const run = async () => {
    try {
        const response = await snsClient.send(new UnsubscribeCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
