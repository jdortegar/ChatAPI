import express from 'express';
import AWS from 'aws-sdk';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import chatSocket from './services/socket/ChatSocket'; 

const app = express();
// const server = http.Server(app);


// UPdate AWS config 
AWS.config.update({
    accessKeyId: config.AWS.accessKeyId,
    secretAccessKey: config.AWS.secretAccessKey,
    region: config.AWS.awsRegion
});
app.use(bodyParser.json());

app.use('/api/v1/', routes);

const server = app.listen(config.app.port, () => {
    chatSocket.init(server);
    app.locals.chatSocket = chatSocket;
    console.info(`Habla Chat started on port ${config.app.port}`);
    console.info('---------------------------------------------------------------')
}) 
// server.listen(config.app.port, () => {
//     console.info(`Habla Chat running on port ${config.app.port}`);
// });