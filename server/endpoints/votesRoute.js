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
        let voter;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            voter = userID.userId;       
        }
        const {arcId, nodeId, voteValue } = req.body;

        if (voter === "" || voteValue === "" || (arcId === "" && nodeId === "") || (arcId !== "" && nodeId !== "")) {
            throw new Error(`Error! The data provided can not be inserted!`);
        };
        await dataVerifications.verifyKeyExists(voter, 'Users', contract);
        if (nodeId !== '' && nodeId !== undefined) {
            await dataVerifications.verifyKeyExists(nodeId, 'Nodes', contract);
        }
        if (arcId !== '' && arcId !== undefined) {
            await dataVerifications.verifyKeyExists(arcId, 'Arcs', contract);
        }

        const key = uuidv4();
        const createdAt = new Date();
        await contract.submitTransaction('createVotes', key, voter, arcId || '', nodeId || '', voteValue, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteVotes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteVotes', req.headers.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

