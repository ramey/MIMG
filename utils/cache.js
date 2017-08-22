/**
 * @file - utility file for cache - currently redis
 */
const redis = require('redis');
const redisUrl = require('./../config/redis.json').redisUrl;
const client = redis.createClient(redisUrl);

const getValue = key => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const increment = key => {
    return new Promsie((resolve, reject) => {
        client.incr(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const decrement = key => {
    return new Promsie((resolve, reject) => {
        client.decr(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const addToList = (key, item) => {
    return new Promise((resolve, reject) => {
        client.sadd(key, item, (err, reply) => {
            if(err) {
                return reject(err);
            }
            return resolve(reply);
        })
    });
};

const getUser = key => {
    return new Promise((resolve, reject) => {
        client.spop(key, (err, reply) => {
            if(err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const addToHash = (key, args) => {
    return new Promise((resolve, reject) => {
        client.hmset(key, args, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const getHashKeys = key => {
    return new Promise((resolve, reject) => {
        client.hkeys(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const deleteFromHash = (key, hashKey) => {
    return new Promise((resolve, reject) => {
        client.hdel(key, hashKey, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        })
    })
}

const getHash = key => {
    return new Promise((resolve, reject) => {
        client.hgetall(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const getHashValue = (key, hashKey) => {
    return new Promise((resolve, reject) => {
        client.hget(key, hashKey, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

module.exports = {
    increment,
    decrement,
    getUser,
    addToHash,
    addToList,
    getHash,
    getValue,
    getHashValue,
    deleteFromHash,
    getHashKeys
};