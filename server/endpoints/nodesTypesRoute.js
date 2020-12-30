const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readNodesTypes', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// cria novo tipo
exports.createNodesTypes = async function (req, res, contract) {
    try {
        const { name } = req.body
        await dataVerifications.verifyNameAlreadyExists(name, 'NodesTypes', contract);

        const key = uuidv4();
        const createdAt = new Date();
        await contract.submitTransaction('createNodesTypes', key, name, createdAt);
        return{data:"Created with sucess"}
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// update tipo nodo
exports.updateNodesTypes = async function (req, res, contract) {
    try {
        const { key, name } = req.body;
        await dataVerifications.verifyNameAlreadyExists(name, 'NodesTypes', contract);
        
        await contract.submitTransaction('updateNodesTypes', key, name);
        return { data: "Updated" };
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteNodesTypes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteNodesTypes', req.headers.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
