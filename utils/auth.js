/**
 * @file - utility file for authentication
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * @function - generate JWT token
 * @param {string} username 
 */
const generateJwt = (username) => {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        username,
        exp: parseInt(expiry.getTime() / 1000)
    }, 'mimgsecret')
};

/**
 * @function - sets the password
 * @param {string} password 
 * @return {obj} with salt and hash for the password
 */
const setPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return {
        'salt': salt,
        'hash': hash
    };
};

/**
 * @function - validate passowrd
 * @param {string} password 
 * @param {string} storedHash 
 * @param {string} salt 
 * @returns {boolean} whether user is validated or not
 */
const validPassword = (password, storedHash, salt) => {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === storedHash;
};

module.exports = {
    validPassword,
    setPassword,
    generateJwt
}