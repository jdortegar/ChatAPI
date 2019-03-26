import redis from 'redis';
import config from '../../config';

const client = redis.createClient(`redis://${config.redis.server}:${config.redis.port}`);

export default client;