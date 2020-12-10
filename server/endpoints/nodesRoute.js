const { v4: uuidv4 } = require('uuid');
// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readNodes', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// cria novo tipo
exports.createNodes = async function (req, res, contract) {
    try {
        const key = uuidv4();
        const createdAt = new Date();
        const { description, nodeType, creatorId, userCreated } = req.body;
        await contract.submitTransaction('createNodes', key, description, nodeType, creatorId, userCreated, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateNodes = async function (req, res, contract) {
    try {
        const { key, description, nodeType, creatorId, userCreated } = req.body;
        await contract.submitTransaction('updateNodes', key, description, nodeType, creatorId, userCreated);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteNodes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteNodes', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
