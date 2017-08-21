const request = require('request');
const apiURL = require('./../../../config/api.json').apiURL;
const numQuestions = require('./../../../config/game.json').numQuestions;
const cache = require('./../../../utils/cache');
const db = require('./../../../utils/db')

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

const getImageData = num => {
    const reqOptions = {
        url: `${apiURL}/api/image/${num}/`,
        mehod: 'GET',
        qs: {
            imgType: 'primary'
        }
    };
    return new Promise((resolve, reject) => {
        request(reqOptions, (err, response, body) => {})
        if (err) {
            return reject(err);
        }
        return resolve(response, body)
    });
};

const game = (req, res) => {
    res.render('game', {title: 'Game'});
};

const images = (req, res) => {
    let currentUser, playedUser;
    getUser(req)
        .then(user => {
            if (!user) {
                sendJsonResponse(res, 404, {"message": "User not found"});
            }
            else {
                currentUser = user;
            }
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"message": err.message});
        });

    const respData = {
        images: []
    };
    const totalImages = cache.getValue('primary_images');
    const requiredNum = numQuestions;
    const priImgs = [];
    cache.getUser("completedUsers")
        .then(playeduser => {
            if (playeduser) {
                playedUser = playeduser;
                cache.getHashValues(playeduser)
            } else {
                while (priImgs.length() < requiredNum) {
                    let num = Math.floor(Math.random() * totalImages + 1);
                    if (priImgs.indexOf(num) == -1) {
                        priImgs.push(num);
                    }
                }
            }
        })
        .then(values => {
            priImgs.concat(...Object.keys(values));
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"error": err.message});
        });

    priImgs.forEach(function(num) {
        getImageData(num)
            .then((response, body) => {
                if (response.statusCode === 200) {
                    respData.images.push(body);
                } else {
                    sendJsonResponse(response.statusCode, {"status": 'failed'});
                }
            })
            .catch(err => {
                sendJsonResponse(res, 500, {"status": 'failed', "message": 'Failed to get questions'});
            });    
    }, this);

    if (playedUser) {
        cache.addToHash("pairs", currentUser, playedUser)
            .then(() => {
                sendJsonResponse(200, {"status": 'success', "data": respData});
            })
            .catch(err => {
                sendJsonResponse(res, 500, {"error": err.message});
            })
    } else {
        sendJsonResponse(200, {"status": 'success', "data": respData});
    }
}

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

const expandObj = obj => {
    let expandedObj = Object.keys(obj).reduce((values, key) => {
        values.push(key);
        values.push(obj[key]);
        return values;
    }, []);
    return expandedObj;
}

const compare = (player1, player2) => {
    let score = Object.keys(player1).reduce((score, ques) =>{
        if (player1[ques] === player2[ques]) {
            score++;
        }
        return score;
    }, 0);
    return score;
};

const updateScore = () => {

}

const submit = (req, res) => {
    let currentUser, playedUser;
    getUser(req)
        .then(user => {
            if (!user) {
                sendJsonResponse(res, 404, {"message": "User not found"});
            }
            else {
                currentUser = user;
            }
        })
        
        .catch(err => {
            sendJsonResponse(res, 500, {"message": err.message});
        });
    
    cache.getHashValue("pairs", currentUser)
        .then(playeduser => {
            playedUser = playeduser;
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"error": err.message});
        })

    if (!playeduser) {
        cache.addToList("completedUsers", currentUser.id)
            .then(() => {
                cache.addToHash.apply(playeduser, ...expandObj(req.body.data))
            })
            .then(() => {
                sendJsonResponse(res, 202, {"status": 'success'})
            })
            .catch(err => {
                sendJsonResponse(res, 500, {"error": err.message});
            });
    } else {
        cache.getHashValues(playeduser)
            .then(values => {
                score = compare(values, req.body.data);
                if (score > 0) {
                    updateScore(currentUser);
                    updateScore(playedUser);
                } else {
                    sendJsonResponse(res, 200, {"state": 'success'});                    
                }
            })
            .catch(err => {
                sendJsonResponse(res, 500, {"error": err.message});
            });
    }
}




module.exports = {
    game,
    images,
    submit
}