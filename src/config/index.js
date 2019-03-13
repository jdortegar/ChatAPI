const config = {
    app: {
        port: 4242,
        jwtSecret: process.env.JWT_SECRET || '69157cde-e3a7-4079-b79a-95a35d58c6d3',
        corsOrigins: '*:*',
        environment: process.env.APP_ENV || 'dev',
    },
    database: {
        dynamoDB: {
            endpoint: process.env.DYNAMODB_ENDPOINT || 'https://dynamodb.us-west-2.amazonaws.com',
            tablePrefix: process.env.TABLE_PREFIX || 'CHAT_DEV',
        }
    },
    AWS: {
        accessKeyId: 'AKIAJUWK5MDFUPOKWM4A',
        secretAccessKey: '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',
        awsRegion: 'us-west-2'
    },
    redis: {
        server: process.env.REDIS_SERVER || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        prefix: process.env.REDIS_PREFIX || 'devChat#'
    }
}

export default config;