const config = {
    app: {
        port: 4242
    },
    database: {
        dynamoDB: {
            endpoint: process.env.DYNAMODB_ENDPOINT || 'https://dynamodb.us-west-2.amazonaws.com',
            tablePrefix: process.env.TABLE_PREFIX || 'CHAT_DEV',
        }
    }
}

export default config;