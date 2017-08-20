const db = require('./../../../utils/db');

const sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

const getImgs = (req, res) => {
    sendJsonResponse(res, 200, {"status": "success"});
};
const getImg = (req, res) => {
    sendJsonResponse(res, 200, {"status": "success"});
};
const createImg = (req, res) => {
    sendJsonResponse(res, 200, {"status": "success"});
};
const updateImg = (req, res) => {
    sendJsonResponse(res, 200, {"status": "success"});
};
const deleteImg = (req, res) => {
    sendJsonResponse(res, 200, {"status": "success"});
};
module.exports = {
    getImgs,
    getImg,
    createImg,
    updateImg,
    deleteImg
};