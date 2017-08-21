const redis = require('redis');
const redisConf = require('./../config/redis.json');
const client = redis.createClient(redisConf);

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
        client.rpush(key, item, (err, reply) => {
            if(err) {
                return reject(err);
            }
            return resolve(reply);
        })
    });
};

const getUser = key => {
    return new Promise((resolve, reject) => {
        client.lpop(key, (err, reply) => {
            if(err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const addToHash = (...args) => {
    return new Promise((resolve, reject) => {
        client.hset(...args, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

const getHashValues = key => {
    return new Promise((resolve, reject) => {
        client.hvals(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
};

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
    getHashValues,
    getValue,
    getHashValue
};