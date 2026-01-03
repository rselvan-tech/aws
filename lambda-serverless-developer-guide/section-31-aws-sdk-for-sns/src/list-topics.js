import { ListTopicsCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';

export const run = async () => {
    try {
        const response = await snsClient.send(new ListTopicsCommand());
        console.log('Success : ', response);
    } catch (error) {
        console.log('Error : ', error);
    }
};
run();
