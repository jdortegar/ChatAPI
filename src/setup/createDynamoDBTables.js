import AWS from 'aws-sdk';
import config from '../config';

AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.awsRegion
});

AWS.config.dynamodb = { endpoint: config.database.dynamoDB.endpoint };

var dynamodb = new AWS.DynamoDB();

const tablePrefix = process.argv[2];

function createConversationTable() {
    const params = {
        TableName: `${tablePrefix}_conversations`,
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
    }
    dynamodb.createTable(params, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.info(`Table ${params.TableName} created`);
        }
    });
}

function createMessagesTable() {
    const params = {
        TableName: `${tablePrefix}_messages`,
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'conversationId', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        },
        GlobalSecondaryIndexes: [
            {
                IndexName: 'conversationIdx',
                KeySchema: [
                    { AttributeName: 'conversationId', KeyType: 'HASH' }
                ],
                Projection: { ProjectionType: 'ALL' },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            }
        ]
    };
    dynamodb.createTable(params, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.info(`Table ${params.TableName} created`);
        }
    });

}

createConversationTable();
createMessagesTable();