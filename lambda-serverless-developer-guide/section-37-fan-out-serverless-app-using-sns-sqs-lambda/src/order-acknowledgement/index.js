import { v4 as uuidv4 } from 'uuid';
import { PublishCommand } from '@aws-sdk/client-sns';
import { snsClient } from './sns-client.js';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ddbClient } from './ddb-client.js';

export const handler = async (event) => {
    console.log('event:', JSON.stringify(event, undefined, 2));
    // TODO implement

    // 0- validate incoming event
    // 1- get request body payload
    // 2- generate id with uuid library and prepare payload
    // 3- publish message to sns topic with using sns sdk package
    // 4- save order item into dynamodb with using dnamodb sdk package
    // 5- return back snyc order payload with generated id to the api gateway

    try {
        // 0- validate incoming event
        if (event.httpMethod !== 'POST') {
            throw new Error(`Http Method should be POST. You are requesting : "${event.httpMethod}"`);
        }

        // 1- get request body payload
        const orderRequest = JSON.parse(event.body);
        if (orderRequest === null || orderRequest.type === null) {
            throw new Error(`order type should exist in orderRequest: "${orderRequest}"`);
        }

        // 2- generate id with uuid library and prepare payload
        const orderId = uuidv4();
        orderRequest.id = orderId;

        // 3- publish message to sns topic with using sns sdk package
        // Using environment variable TOPIC_ARN instead of hardcoding ARN
        const params = {
            Message: JSON.stringify(orderRequest),
            TopicArn: process.env.TOPIC_ARN,
        };
        const data = await snsClient.send(new PublishCommand(params));
        console.log('Successfully published SNS Message.', data);

        // 4- save order item into dynamodb with using dnamodb sdk package
        // Using environment variable TABLE_NAME instead of hardcoding table name
        const dynamodbParams = {
            TableName: process.env.TABLE_NAME,
            Item: marshall(orderRequest || {})
        };
        const createResult = await ddbClient.send(new PutItemCommand(dynamodbParams));
        console.log('Successfully create item into order table.', createResult);

        // 5- return back snyc order payload with generated id to the api gateway
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully finished order create operation: "${orderRequest}"`,
                body: data
            })
        };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to perform operation.',
                errorMsg: e.message,
                errorStack: e.stack,
            })
        };
    }
};
