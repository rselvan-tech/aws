import { ListSubscriptionsByTopicCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

const input = {
    TopicArn: 'arn:aws:sns:us-east-2:165015980598:sns-topic'
};

export const run = async () => {
    try {
        const response = await snsClient.send(new ListSubscriptionsByTopicCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
