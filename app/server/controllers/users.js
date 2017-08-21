const passport = require('passport');
const auth = require('./../../../utils/auth');
const db = require('./../../../utils/db');

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

const register = (req, res) => {
    if (!req.body.username) {
        sendJsonResponse(res, 400, {"message":'Username required'});
    }
    const {salt, hash} = auth.setPassword(req.body.password);
    const query = `insert into users(\`username\`, \`hash\`, \`salt\`) values (${req.body.username}, ${salt}, ${hash}) ;`;
    db.query(query)
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