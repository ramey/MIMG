const redis = require('redis');
const redisConf = require('./../config/redis.json');
const client = redis.createClient(redisConf);

const getValue = key => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

const increment = key => {
    return new Promsie((resolve, reject) => {
        client.incr(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

const addToList = (key, item) => {
    return new Promise((resolve, reject) => {
        client.rpush(key, item, (err, reply) => {
            if(err) {
                reject(err);
            }
            resolve(reply);
        })
    });
};

const getUser = key => {
    return new Promise((resolve, reject) => {
        client.lpop(key, (err, reply) => {
            if(err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

const addToHash = (key, hashKey, hashValue) => {
    return new Promise((resolve, reject) => {
        client.hset(key, hashKey, hashValue, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

const getHashValues = key => {
    return new Promise((resolve, reject) => {
        client.hvals(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

module.exports = {
    increment,
    getUser,
    addToHash,
    addToList,
    getHashValues,
    getValue
};