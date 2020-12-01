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
        const { id, name} = req.body;
        await contract.submitTransaction('createUsersTypes', id, name);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
}