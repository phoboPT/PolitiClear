// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readUsers', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// search by name
exports.getByName = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readUsers', req.params.name);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Create user
exports.createUsers = async function (req, res, contract) {
    try {
        const { name, email, password } = req.body;
        await contract.submitTransaction('createUsers', name, email, password);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateUsers = async function (req, res, contract) {
    try {
        const { key, name, email, password } = req.body;
        await contract.submitTransaction('updateUsers', key, name, email, password);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

//delete user
exports.deleteUsers = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteUsers', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
