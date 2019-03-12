const config = {
    app: {
        port: 4242,
        jwtSecret: proces.env.JWT_SECRET || '69157cde-e3a7-4079-b79a-95a35d58c6d3',
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
    }
}

export default config;