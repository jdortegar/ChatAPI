import express from 'express';
import http from 'http';
import config from './config';

const app = express();
const server = http.Server(app);

server.listen(config.app.port, () => {
    console.info(`Habla Chat running on port ${config.app.port}`);
});