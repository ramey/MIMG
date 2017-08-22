const db = require('./../../../utils/db');

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

/**
 * @func - handler for GET scores API
 * @param {obj} req 
 * @param {obj} res 
 */
const getScore = (req, res) => {
    const query = `select * from scores where user = '${req.params.username}';`
    db.query(query)
        .then((results, _) => {
            if (results.length == 0) {
                sendJsonResponse(res, 404, {"status": 'failed', "message": 'No score found'})
            }
            sendJsonResponse(res, 200, {"status": 'success', "score": results[0].score});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for POST scores API
 * @param {obj} req 
 * @param {obj} res 
 */
const createScore = (req, res) => {
    query = `insert into scores (\`user\`) values('${req.body.user}');`;
    db.query(query)
        .then(() => {
            sendJsonResponse(res, 201, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for PUT scores API
 * @param {obj} req 
 * @param {obj} res 
 */
const updateScore = (req, res) => {
    if (Object.keys(req.body) == 0) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'No data to update'});
    }
    query = `update scores set score = ${req.body.score} where user = '${req.params.username}';`;
    db.query(query)
        .then(() => {
            sendJsonResponse(res, 200, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for DELETE scores API
 * @param {obj} req 
 * @param {obj} res 
 */
const deleteScore = (req, res) => {
    const query = `delete from scores where user = ${req.params.userid};`;
    db.query(query)
        .then(() => {
            sendJsonResponse(res, 204, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

module.exports = {
    createScore,
    getScore,
    updateScore,
    deleteScore
}