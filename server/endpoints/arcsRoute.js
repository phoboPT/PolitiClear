const { v4: uuidv4 } = require('uuid');
const dataVerifications = require('./functions/dataVerifications');
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readArcs', req.params.key);
        return { data: JSON.parse(response) }
    } catch (e) {
        return { error: e.message }
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
        const { description, initialNode, finalNode } = req.body;
        await dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(creatorId, 'Users', contract);

        await contract.submitTransaction('createArcs', key, description, initialNode, finalNode, creatorId, createdAt, 0);
        return { data: "Created" }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        let creatorId;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        const { key, description, initialNode, finalNode } = req.body;
        await contract.submitTransaction('updateArcs', key, description, initialNode, finalNode, creatorId, '');
        return { data: "Updated" }
    } catch (e) {
        return { error: e.message }
    }
};

// delete user
exports.deleteArcs = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteArcs', req.headers.key);
        const data = await contract.submitTransaction("queryByObjectType", "Votes");

        JSON.parse(data).forEach((votesData) => {
            if (votesData.Record.arcId === req.headers.key) {
                contract.submitTransaction('deleteVotes', votesData.Key);
            }
        });
        return { data: "Deleted" }
    } catch (e) {
        return { error: e.message }
    }
};
