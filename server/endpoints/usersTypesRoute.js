const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");
// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readUsersTypes', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// cria novo tipo
exports.createUsersTypes = async function (req, res, contract) {
    try {
        const { name } = req.body;
        await dataVerifications.verifyNameAlreadyExists(name, 'UsersTypes', contract);

        const key = uuidv4();
        const createdAt = new Date();
        await contract.submitTransaction('createUsersTypes', key, name, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateUsersTypes = async function (req, res, contract) {
    try {
        const { key, name } = req.body;
        await dataVerifications.verifyNameAlreadyExists(name, 'UsersTypes', contract);
        
        await contract.submitTransaction('updateUsersTypes', key, name);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteUsersTypes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteUsersTypes', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
