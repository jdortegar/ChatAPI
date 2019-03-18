import AWS from 'aws-sdk';
import _ from 'lodash';
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
        console.error(err);
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
        return result.Items;
    } catch (err) {
        return Promise.reject(err);
    }
}

export const getConversationById = async (id) => {
    try {
        const params = { 
            TableName:  `${config.database.dynamoDB.tablePrefix}_conversations`,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id
            }
        }
        const data = await dbClient.query(params).promise();
        return data.Items[0];
    } catch (err) {
        return Promise.reject(err);
    }
}

export const updateConversation = async (id, updates, originalVals) => {
    try {
        const params = {
            TableName: `${config.database.dynamoDB.tablePrefix}_conversations`,
            Key: { id },
            UpdateExpression: 'set active = :active, appData = :appData, description = :description, members = :members, messageCount = :messageCount, organization = :organization, title = :title',
            ExpressionAttributeValues: {
                ':active': updates.active || originalVals.active,
                ':appData': updates.appData || originalVals.appData,
                ':description': updates.description || originalVals.description,
                ':members': updates.members || originalVals.members,
                ':messageCount': updates.messageCount || originalVals.messageCount,
                ':organization': updates.organization || originalVals.organization,
                ':title': updates.title || originalVals.title
            }
        }
        return dbClient.update(params).promise();
    } catch (err) {
        return Promise.reject(err);
    }
}
