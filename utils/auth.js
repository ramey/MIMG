const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateJwt = (username) => {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'mimgsecret')
};

const setPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
    return {
        salt,
        hash
    };
};

const validPassword = (password, storedHash, salt) => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
    return hash === storedHash;
};

module.exports = {
    validPassword,
    setPassword,
    generateJwt
}