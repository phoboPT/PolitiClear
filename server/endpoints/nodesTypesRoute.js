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
        const key = uuidv4();
        await contract.submitTransaction('createNodesTypes', key, req.body.name);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// update tipo nodo
exports.updateNodesTypes = async function (req, res, contract) {
    try {
        const { key, name } = req.body;
        await contract.submitTransaction('updateNodesTypes', key, name);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteNodesTypes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteNodesTypes', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
