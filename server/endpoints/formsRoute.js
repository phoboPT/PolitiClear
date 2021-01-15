const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readForms', req.params.key);
        return { data: JSON.parse(response) }
    } catch (e) {
        return { error: e.message }
    }
};

// create new form
exports.createForms = async function (req, res, contract) {
    try {
        const { token, message, email = "", upgradeRequest = false } = req.body;
        const createdBy = jwt.verify(token, "MySecret");
        const key = uuidv4();
        const createdAt = new Date();
        
        let creatorByDescription = await contract.submitTransaction('readUsers', createdBy.userId);
        creatorByDescription = JSON.parse(creatorByDescription).name;

        await contract.submitTransaction('createForms', key, email, message, createdAt, "Open", "", createdBy.userId, creatorByDescription, upgradeRequest);
        return { data: "Created" }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateForms = async function (req, res, contract) {
    try {
        const { key, status = "", response = "" } = req.body;
        let creatorByDescription = await contract.submitTransaction('readUsers', createdBy.userId);
        creatorByDescription = JSON.parse(creatorByDescription).name;

        await contract.submitTransaction('updateForms', key, status, response);
        return { data: "Updated" }
    } catch (e) {
        return { error: e.message }
    }
};

// delete user
exports.deleteForms = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteForms', req.headers.key);
        return { data: "Deleted" }
    } catch (e) {
        return { error: e.message }
    }
};
