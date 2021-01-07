const { v4: uuidv4 } = require('uuid');
const dataVerifications = require('./functions/dataVerifications');
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readArcs', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// create new form
exports.createArcs = async function (req, res, contract) {
    try {
        let creatorId;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        const key = uuidv4();
        const createdAt = new Date();
        const { description, initialNode, finalNode, totalVotes } = req.body;
        await dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(creatorId, 'Users', contract);

        await contract.submitTransaction('createArcs', key, description, initialNode, finalNode, creatorId, createdAt, totalVotes);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        let creatorId;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        const { key, description, initialNode, finalNode, totalVotes } = req.body;
        await dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
        await contract.submitTransaction('updateArcs', key, description, initialNode, finalNode, creatorId, totalVotes);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// delete user
exports.deleteArcs = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteArcs', req.headers.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
