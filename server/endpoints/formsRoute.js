const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readForms', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// create new form
exports.createForms = async function (req, res, contract) {
    try {
        const key = uuidv4();
        const createdAt = new Date();
        const { token, message,email="",upgradeRequest=false } = req.body;
        const createdBy = jwt.verify(token, "MySecret");
        await contract.submitTransaction('createForms', key, email, message, createdAt,createdBy.userId,upgradeRequest);
       return{data:"Created"}
    } catch (e) {
        return {data:e.message}
    }
};

exports.updateForms = async function (req, res, contract) {
    try {

        const { key, email = "", message = "", status = "", response = "" } = req.body;
        
       await contract.submitTransaction('updateForms', key, email, message,status,response);
        return {data:"Updated"}
    } catch (e) {
        return {error:e.message}
    }
};

// delete user
exports.deleteForms = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteForms', req.headers.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};