import redis from 'redis';
import config from '../../config';

console.log('***REDIS CONFIGURATION****', config.redis);
const client = redis.createClient(`redis://${config.redis.server}:${config.redis.port}`);

export default client;