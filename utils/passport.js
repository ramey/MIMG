const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const db = require('./db');
const auth = require('./auth')

passport.use(new LocalStratergy({}, (username, password, done) => {
        query = `select * from users where username = '${username}';`;
        db.query(query)
            .then((results, _) => {
                if (results.length == 0) {
                    return done(null, false, {message: 'Incorrect username'});
                }
                if (!auth.validPassword(password, results[0].hash, results[0].salt)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, results[0]);
            })
            .catch(err => {
                return done(err);
            });
    }
));