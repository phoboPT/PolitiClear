const { v4: uuidv4 } = require('uuid');
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
        const { creatorId, arcId, nodeId } = req.body;
        await contract.submitTransaction('createVotes', key, creatorId, arcId, nodeId, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateVotes = async function (req, res, contract) {
    try {
        const { key, creatorId, arcId, nodeId } = req.body;
        await contract.submitTransaction('updateVotes', key, creatorId, arcId, nodeId);
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
