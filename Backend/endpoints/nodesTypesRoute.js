const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readNodesTypes', req.params.key);
        return { data: JSON.parse(response) };
    } catch (e) {
        return { error: e.message };
    }
};

// cria novo tipo
exports.createNodesTypes = async function (req, res, contract) {
    try {
        const { name } = req.body;
        const key = uuidv4();
        const createdAt = new Date();      

       const res= await contract.submitTransaction('createNodesTypes', key,name,createdAt);
        return JSON.parse(res) ;
    } catch (e) {
        return { error: e.message };
    }
};

exports.deleteNodesTypes = async function (req, res, contract) {
    try {
        if (req.headers.key === "" || req.headers.key === undefined) {
            return { error: "Key must be provided!" };
        }
        const data = await contract.submitTransaction("queryByObjectType", "Nodes");
        const response = JSON.parse(data);
        for (let i = 0; i < response.length; i++) {
            if (response[i].Record.nodeType === req.headers.key) {
                return { error: 'Delete denied! The system use this type' };
            }
        };

        await contract.submitTransaction('deleteNodesTypes', req.headers.key);
        return { data: "Deleted" };

    } catch (e) {
        return { error: e.message };
    }
};

