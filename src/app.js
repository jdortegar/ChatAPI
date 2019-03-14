import express from 'express';
import http from 'http';
import AWS from 'aws-sdk';
import config from './config';
import chatSocket from './services/socket/ChatSocket'; 

const app = express();
// const server = http.Server(app);


// UPdate AWS config 
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.awsRegion
});

const server = app.listen(config.app.port, () => {
    chatSocket.init(server);
    console.info(`Habla Chat started on port ${config.app.port}`);
    console.info('---------------------------------------------------------------')
}) 
// server.listen(config.app.port, () => {
//     console.info(`Habla Chat running on port ${config.app.port}`);
// });