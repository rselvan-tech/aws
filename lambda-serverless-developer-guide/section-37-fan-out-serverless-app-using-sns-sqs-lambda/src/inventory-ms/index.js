import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { ddbClient } from './ddb-client.js';

export const handler = async function (event) {
    console.log('request:', JSON.stringify(event, undefined, 2));

    // 1- iterate sqs records
    // 2- get request body payload of sns
    // 3- get request body payload of order data
    // 4- save order item into inventory dynamodb table with using dnamodb sdk package

    try {
        // 1- iterate sqs records
        for (const record of event.Records) {
            console.log('SQS Record: %j', record);

            // 2- get request body payload of sns
            const snsPublishedMessage = JSON.parse(record.body);
            console.log('SNS Message: %j', snsPublishedMessage);

            // 3- get request body payload of order data
            const orderRequest = JSON.parse(snsPublishedMessage.Message);
            console.log('Order Request Payload: %j', orderRequest);

            // business logic and prepared inventoryItem
            if (orderRequest === null || orderRequest.type === null || orderRequest.type !== 'SHIP_REQUIRED') {
                throw new Error(`order type should exist and should be SHIP_REQUIRED in orderRequest: "${orderRequest}"`);
            }

            // set PK of invetory table
            orderRequest.code = orderRequest.item;
            console.log('DynamoDB orderRequest:', JSON.stringify(orderRequest, null, 2));

            // 4- save order item into inventory dynamodb table with using dnamodb sdk package
            // Using environment variable TABLE_NAME instead of hardcoding table name
            const dynamodbParams = {
                TableName: process.env.TABLE_NAME,
                Item: marshall(orderRequest || {}, {
                    removeUndefinedValues: true  // Remove an item ,if its "undefined"
                })
            };

            const createResult = await ddbClient.send(new PutItemCommand(dynamodbParams));
            console.log('Successfully create item into inventory table.', createResult);
        }

    } catch (e) {
        console.error(e);
    }
};
