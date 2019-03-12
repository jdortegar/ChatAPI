import express from 'express';
import http from 'http';
import AWS from 'aws-sdk';
import config from './config';

const app = express();
const server = http.Server(app);


// UPdate AWS config 
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.awsRegion
});

server.listen(config.app.port, () => {
    console.info(`Habla Chat running on port ${config.app.port}`);
});