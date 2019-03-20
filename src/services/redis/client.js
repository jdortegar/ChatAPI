import redis from 'redis';
import config from '../../config';

console.log('***REDIS CONFIGURATION****', config.redis);
const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
});

export default client;