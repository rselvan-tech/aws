import { CreateTopicCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

const input = {
    Name: 'sns-topic'
};

export const run = async () => {
    try {
        const response = await snsClient.send(new CreateTopicCommand(input));
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
