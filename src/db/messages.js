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

function tableName() {
    return `${config.database.dynamoDB.tablePrefix}_messages`;
}

/**
 * Saves a message in the database;
 * 
 * @param {String} id 
 * @param {String} conversationId 
 * @param {Object[]} content 
 * @param {String} replyTo 
 * @param {String} createdBy 
 * @param {Number} bytecount 
 * @param {String} created 
 * @param {String} lastModified 
 */
export const createMessage = async (id, conversationId, content, replyTo, createdBy, bytecount, created, lastModified) => {
    try {
        const params = {
            TableName: tableName(),
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
