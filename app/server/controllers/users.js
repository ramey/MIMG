const passport = require('passport');
const auth = require('./../../../utils/auth');
const db = require('./../../../utils/db');
const apiURL = require('./../../../config/api.json').apiURL;
const request = require('request');

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

const updateScore = username => {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            url: `${apiURL}/api/scores`,
            method: 'POST',
            json: {
                'user': username
            },
            timeout: 5000
        };
        request(reqOptions, (err, response, body) => {
            if (err) {
                return reject(err);
            }
            if (response.statusCode === 201) {
                return resolve();
            } else {
                return reject(new Error("Error in updating score"));
            }
        });
    });
}

const register = (req, res) => {
    if (!req.body.username) {
        sendJsonResponse(res, 400, {"message":'Username required'});
    }
    const {salt, hash} = auth.setPassword(req.body.password);
    const query = `insert into users(\`username\`, \`hash\`, \`salt\`) values ('${req.body.username}', '${hash}', '${salt}') ;`;
    db.query(query)
        .then(() => {
            updateScore(req.body.username);
        })
        .then(() => {
            const token = auth.generateJwt(req.body.username);
            sendJsonResponse(res, 200, {"token": token});             
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"message": 'Error while contacting database.', "error": err});
        })
}

const login = (req, res) => {
    if (!req.body.username || !req.body.password) {
        sendJsonResponse(res, 400, {"message": 'All fields are required'});
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            sendJsonResponse(res, 404, err);
        }
        if (user) {
            const token = auth.generateJwt(user.username);
            sendJsonResponse(res, 200, {"token": token});
        } else {
            sendJsonResponse(res, 401, info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
}