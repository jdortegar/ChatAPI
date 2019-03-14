import moment from 'moment';
import _ from 'lodash';
import redis from '../redis/client';
import config from '../../config';

const defaultExpirationMinutes = 7 * 24 * 60; // 1 week in minutes.

const hashKey = (userId) => {
    return `${userId}#presence`;
};

/**
 * Returns the presence status of the user from Redis.
 * @param {String} userId 
 */
export const getPresence = async (userId) => {
    try {
        const now = moment();
        await redis.zremrangebyscoreAsync(`${config.redis.prefix}${hashKey(userId)}`, 0, req.now.unix());
        const presenceAsStrings = await redis.zrangebyscoreAsync(
            `${config.redis.prefix}${hashKey(userId)}`,
            now.unix(),
            moment(now).add(defaultExpirationMinutes, 'minutes').unix()
        );
        const presences = [];
        presenceAsStrings.forEach((presenceAsString) => { presences.push(JSON.parse(presenceAsString)); });
        return presences;
    } catch (err) {
        return Promise.reject(err);
    }
}

/**
 * Sets in Redis the status presence of one user. 
 * 
 * @param {String} userId 
 * @param {String} presence 
 */
export const setPresence = async (userId, presence) => {
    try {
        const now = moment();
        const hash = hashKey(userId);
        const ttl = moment(now).add(defaultExpirationMinutes, 'minutes').unix();
        const presences = await getPresence(userId);
        const foundPresences = presences.filter((pres) => {
            return (pres.address === presence.address) && (pres.userAgent === presence.userAgent);
        });
        let previousLocation
        if (foundPresences.length > 0) {
            previousLocation = foundPresences[0].location;
            await redis.zremAsync(`${config.redis.prefix}${hash}`, JSON.stringify(foundPresences[0]));
        }
        const cachePresence = _.cloneDeep(presence);
        cachePresence.location = cachePresence.location || previousLocation
        await redis.zaddAsync(`${config.redis.prefix}`, ttl, JSON.stringify(cachePresence));
    } catch (err) {
        return Promise.reject(err);
    }
}