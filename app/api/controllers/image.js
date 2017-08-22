const db = require('./../../../utils/db');
const cache = require('./../../../utils/cache');

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

/**
 * @func - handler for GET image API
 * @param {obj} req 
 * @param {obj} res 
 */
const getImg = (req, res) => {
    const imgType = req.query['imgType'];
    if (imgType == undefined) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'image type not found in query'});        
    };
    const query = `select * from ${imgType}_images where id = '${req.params.imgid}';`
    db.query(query)
        .then((results, _) => {
            if (results.length == 0) {
                sendJsonResponse(res, 404, {"status": 'failed', "message": 'No image found'})
            }
            sendJsonResponse(res, 200, {"status": 'success', "image": results[0]});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for POST image API
 * @param {obj} req 
 * @param {obj} res 
 */
const createImg = (req, res) => {
    const imgType = req.query['imgType'];
    let query;
    if (imgType == undefined) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'image type not found in query'});        
    };
    if (!req.body.image_src) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'missing param image_src'});
    }

    if (imgType == 'secondary') {
        if (!req.body.primary_image) {
            sendJsonResponse(res, 400, {"status": 'failed', "message": 'primary image not given for secondary image'});
        }
        query = `insert into ${imgType}_images (\`primary_image\`, \`image_src\`) values (${req.body.primary_image}, '${req.body.img_src}');`;
    }
    if (imgType == 'primary') {
        query = `insert into ${imgType}_images (\`image_src\`) values('${req.body.image_src}');`;
    }
    db.query(query)
        .then(() => {
            if (imgType == 'primary') {
                cache.increment('primary_images');
            }
            sendJsonResponse(res, 201, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for GET secondary image from primary image API
 * @param {obj} req 
 * @param {obj} res 
 */
const getSecondaryImgs = (req, res) => {
    const query = `select * from secondary_images where primary_image = '${req.params.priImage}';`;
    db.query(query)
        .then((results, _) => {
            if (results.length == 0) {
                sendJsonResponse(res, 404, {"status": 'failed', "message": 'No image found'})
            }
            sendJsonResponse(res, 200, {"status": 'success', "images": results});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
}

/**
 * @func - handler for PUT image API
 * @param {obj} req 
 * @param {obj} res 
 */
const updateImg = (req, res) => {
    if (Object.keys(req.body) == 0) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'No data to update'});
    }
    const imgType = req.query['imgType'];
    let query;
    if (imgType == undefined) {
        sendJsonResponse(res, 400, {"status": 'failed', "message": 'image type not found in query'});        
    };
    query = `update ${imgType}_images set `;
    if ('primary_image' in req.body) {
        query = query.concat(`primary_image = '${req.body.primary_image}'`);
    }
    if ('image_src' in req.body) {
        if ('primary_image' in req.body) {
            query = query.concat(`, `);
        }
        query = query.concat(`image_src = '${req.body.image_src}' `);
    }
    query.concat(`where id = '${req.params.imgid}';`);
    db.query(query)
        .then(() => {
            sendJsonResponse(res, 200, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

/**
 * @func - handler for DELETE image API
 * @param {obj} req 
 * @param {obj} res 
 */
const deleteImg = (req, res) => {
    const imgType = req.query['imgType'];
    const query = `delete from ${imgType} where id = ${req.params.imgid};`;
    db.query(query)
        .then(() => {
            if (imgType == 'primary') {
                cache.decrement('primary_images');
            }
            sendJsonResponse(res, 204, {"status": 'success'});
        })
        .catch(err => {
            sendJsonResponse(res, 500, {"status": 'faled', "message": 'Error while contacting database.', "error": err});
        });
};

module.exports = {
    getImg,
    createImg,
    updateImg,
    deleteImg,
    getSecondaryImgs
};