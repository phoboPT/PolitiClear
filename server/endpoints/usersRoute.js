// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readUsers', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Pesquisa por name
exports.getByName = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readUsers', req.params.name);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.setUsers = async function (req, res, contract) {
    try {
        const { id, name, email, password } = req.body;
        await contract.submitTransaction('createUsers', id, name, email, password);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
}



