const { CLIEngine } = require('eslint');
const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readVotes', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// cria novo tipo
exports.createVotes = async function (req, res, contract) {
    try {

        const key = uuidv4();
        const createdAt = new Date();
        const { voter, arcId, nodeId } = req.body;

        await dataVerifications.verifyKeyExists(voter, 'Users', contract);
        await dataVerifications.verifyKeyExists(nodeId, 'Nodes', contract);
        await dataVerifications.verifyKeyExists(arcId, 'Arcs', contract);
        await contract.submitTransaction('createVotes', key, voter, arcId, nodeId, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateVotes = async function (req, res, contract) {
    try {
        const { key, voter, arcId, nodeId } = req.body;

        await verifyKey(voter, 'Users', contract);
        await verifyKey(nodeId, 'Nodes', contract);
        await verifyKey(arcId, 'Arcs', contract);

        await contract.submitTransaction('updateVotes', key, voter, arcId, nodeId);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteVotes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteVotes', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
