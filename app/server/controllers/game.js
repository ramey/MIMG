/**
 * @file Controllers for game route
 */
const request = require('request');
const apiURL = require('./../../../config/api.json').apiURL;
const numQuestions = require('./../../../config/game.json').numQuestions;
const cache = require('./../../../utils/cache');
const db = require('./../../../utils/db');


/**
 * @function - common function for requests
 * @param {obj} res 
 * @param {number} status - response code for request 
 * @param {obj} content - to be sent with response
 */
const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

/**
 * @function - get the image data from DB
 * @param {string} arg - the image id
 * @param {string} type - whether it's a primary or secondary image
 */
function getImageData(arg, type) {
    let requrl = `${apiURL}/api/image/${arg}/`;
    
    if (type == 'secondary') {
        requrl = `${apiURL}/api/image/secondary/${arg}/`;
    }
    
    const reqOptions = {
        url: requrl,
        mehod: 'GET',
        qs: {
            imgType: type
        }
    };
    return new Promise((resolve, reject) => {
        request(reqOptions, (err, response, body) => {
            if (err) {
                return reject(err);
            }
            if (response.statusCode === 200) {
                if (type === 'primary') {
                    return getImageData(arg, 'secondary')
                        .then(images => {
                            const resp = {'primary': JSON.parse(body).image, 'secondary': images};
                            return resolve(resp);
                        })
                        .catch(err => reject(err))
                
                }
                return resolve(JSON.parse(body).images);
            } else {
                return reject(new Error("Error in getting image"));
            }
        })
    });
};

/**
 * @function - handler for GET game API
 * @param {obj} req 
 * @param {obj} res 
 */
const images = (req, res) => {
    let currentUser, playedUser, totalImages, respData;
    const requiredNum = numQuestions;
    const priImgs = [];
    const priImgsNum = [];
    getUser(req)
        .then(user => {
            if (!user) {
                sendJsonResponse(res, 404, {"message": "User not found"});
            }
            currentUser = user.username;
            return cache.getValue('primary_images');
        })
        .then(value => {
            totalImages = value;
            return cache.getUser("completedUsers")
        })
        .then(playeduser => {
            if (playeduser && playeduser != currentUser) {
                playedUser = playeduser;
                return cache.getHashKeys(playedUser)
            } else {
                while (priImgs.length < requiredNum) {
                    let num = Math.floor(Math.random() * totalImages + 1);
                    if (priImgsNum.indexOf(num) === -1) {
                        priImgsNum.push(num);
                        priImgs.push(getImageData(num, 'primary'))
                    }                
                }
            }
        })
        .then(values => {
            if (values) {
                values.forEach(function(num) {
                    priImgs.push(getImageData(num, 'primary'));
                }, this);
            }
            Promise.all(priImgs).then((response) => {
                respData = response
                if (playedUser) {
                    cache.addToHash("pairs", [currentUser, playedUser])
                        .then(() => {
                            sendJsonResponse(res, 200, {"status": 'success', "data": respData});            
                        })
                }
                sendJsonResponse(res, 200, {"status": 'success', "data": respData});
            })
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"message": err.message});
        });

}

/**
 * @function - get user details from request
 * @param {obj} req 
 */
const getUser = (req) => {
    return new Promise((resolve, reject) => {
        if (req.payload && req.payload.username) {
            query = `select * from users where username = '${req.payload.username}';`;
            db.query(query)
                .then((results, _) => {
                    return resolve(results[0]);
                })
                .catch(err => {
                    return reject(err);
                })
        } else {
            return reject(new Error("User not found"));
        }
    });
};

/**
 * @function - utility function to expand object to an array with key followed by value
 * @param {object} obj 
 */
const expandObj = obj => {
    let expandedObj = Object.keys(obj).reduce((values, key) => {
        values.push(key);
        values.push(obj[key]);
        return values;
    }, []);
    return expandedObj;
}

/**
 * @function - compare the solutions of player1 and player2 result
 * @param {obj} player1 
 * @param {obj} player2 
 */
const compare = (player1, player2) => {
    let score = Object.keys(player1).reduce((score, ques) =>{
        if (player1[ques] === player2[ques]) {
            score++;
        }
        return score;
    }, 0);
    return score;
};

/**
 * @function - get score for a user by calling score API
 * @param {string} user - username for the score wanted
 */
const getScore = user => {
    return new Promise((resolve, reject) => {
        reqOptions = {
            url: `${apiURL}/api/scores/${user}`,
            method: 'GET'
        };
        request(reqOptions, (err, response, body) => {
            if (err) {
                return reject(err);
            } else {
                if (response.statusCode === 200) {
                    oldScore = JSON.parse(body).score;
                    return resolve(oldScore);
                } else {
                    return reject(new Error('Error while getting score'));
                }
            }
        });
    });
};

/**
 * @function - to update score using scores API
 * @param {string} user - user whose score is updated
 * @param {string} score - the score that needs to be added
 */
const updateScore = (user, score) => {
    return new Promise((resolve, reject) => {
        getScore(user)
            .then(oldScore => {
                const finalScore = score + oldScore;
                const reqOptions = {
                    url: `${apiURL}/api/scores/${user}`,
                    method: 'PUT',
                    json: {
                        'score': finalScore
                    }
                };
                request(reqOptions, (err, response, body) => {
                    if (err) {
                        return reject(err);
                    } else {
                        if (response.statusCode === 200) {
                            return resolve();
                        } else {
                            reject(new Error("Error in updating score"));
                        }
                    }
                });             
            })
            .catch(err => reject(err));
    });
}

/**
 * @function - handler for game POST /image API 
 * @param {obj} req 
 * @param {obj} res 
 */
const submit = (req, res) => {
    if (Object.keys(req.body).length !==  numQuestions) {
        sendJsonResponse(res, 400, {"message": 'All questions not completed'});
    }
    let currentUser, playedUser;
    getUser(req)
        .then(user => {
            currentUser = user.username;  
            return cache.getHashValue("pairs", currentUser)
        })
        .then(playeduser => {
            playedUser = playeduser;
            if (!playedUser) {
                return cache.addToList("completedUsers", currentUser)
            } else {
                return cache.getHash(playeduser);
            }
        })
        .then((values) => {
            if (!playedUser) {
                const args = expandObj(req.body);
                return cache.addToHash(currentUser, args);
            } else {
                score = compare(values, req.body);
                if (score > 0) {
                    updateScore(currentUser, score)
                        .then(() => updateScore(playedUser, score))
                        .then(() => {
                            return cache.deleteFromHash("pairs", currentUser);
                        })
                        .then(() => {
                            sendJsonResponse(res, 200, {"state": 'success'});                            
                        })
                        .catch(err => {
                            sendJsonResponse(res, 500, {"error": err.message});
                        })
                } else {
                    sendJsonResponse(res, 200, {"state": 'success'});                    
                }
            }
        })
        .then(() => {
            sendJsonResponse(res, 202, {"status": 'success'})
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"message": err.message});
        });
}

module.exports = {
    images,
    submit
}