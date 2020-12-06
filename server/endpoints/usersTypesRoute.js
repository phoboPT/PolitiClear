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
exports.setUsersTypes = async function (req, res, contract) {
    try {
        await contract.submitTransaction('createUsersTypes', req.body.name);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
}

// Update User
exports.updateUsersTypes = async function (req, res, contract) {
    try {
        const { id, name } = req.body;
        await contract.submitTransaction('updateUsersTypes', id, name);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};