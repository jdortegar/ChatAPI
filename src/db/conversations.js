import AWS from 'aws-sdk';
import config from '../config';

AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.awsRegion
});
AWS.config.dynamodb = { endpoint: config.database.dynamoDB.endpoint };
const dbClient = new AWS.DynamoDB.DocumentClient();

export const createConversation = async (id, members, title, description, messageCount, organization, appData, active) => {
    try {
        members.sort();
        const params = {
            TableName: `${config.database.dynamoDB.tablePrefix}_conversations`,
            Item: {
                id,
                members,
                title,
                description,
                messageCount,
                organization,
                appData,
                active
            }
        };
        return await dbClient.put(params).promise();
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

export const getConversationsByUserId = async (userId) => {
    try {
        const params = {
            TableName: `${config.database.dynamoDB.tablePrefix}_conversations`,
            ExpressionAttributeNames: {
                '#members': 'members'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            },
            FilterExpression: 'contains(#members, :userId)'
        }
        const result = await dbClient.scan(params).promise();
        return result.rows;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const getConversationById = async (id) => {
    try {
        const params = { 
            TableName: TableName(),
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        }
        const data = await dbClient.query(params).promise();
        return data.Items;
    } catch (err) {
        return Promise.reject(err);
    }
}