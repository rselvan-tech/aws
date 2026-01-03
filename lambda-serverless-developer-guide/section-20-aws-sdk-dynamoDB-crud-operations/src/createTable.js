import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { ddbClient } from './dynamoDBClient.js';

export const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'userName',
        AttributeType: 'S',
      },
      {
        AttributeName: 'orderDate',
        AttributeType: 'S',
      }
    ],
    KeySchema: [
      {
        AttributeName: 'userName',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'orderDate',
        KeyType: 'RANGE',
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'order',
    StreamSpecification: {
      StreamEnabled: false,
    },
};

// export const create = async () => {
//     try {
//         const data = await ddbClient.send(new CreateTableCommand(params));
//         console.log("Table Created",data);

//     } catch (error) {
//         console.log("Error",error);
//     }
// }
// create();

export const list = async () => {
    try {
        const data = await ddbClient.send(new ListTablesCommand());
        console.log(data);

    } catch (error) {
        console.log('Error',error);
    }
};
list();
