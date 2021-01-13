const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readNodesTypes', req.params.key);
        return { data: JSON.parse(response) }
    } catch (e) {
        return {error: e.message};
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



        return { data: "Created" };
    } catch (e) {
        return {error: e.message};
    }
};



// update tipo nodo
exports.updateNodesTypes = async function (req, res, contract) {
    try {
        const { name, key } = req.body;
       await dataVerifications.verifyNameAlreadyExists(name, 'NodesTypes', contract);
        await contract.submitTransaction('updateNodesTypes', key, name);
        return { data: "Updated" };
    } catch (e) {
        return {error: e.message};
    }
};

exports.deleteNodesTypes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteNodesTypes', req.headers.key);
        return { data: "Deleted" };
    } catch (e) {
        return {error: e.message};
    }
};

