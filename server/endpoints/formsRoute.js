const { v4: uuidv4 } = require('uuid');

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readForms', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// create new form
exports.createForms = async function (req, res, contract) {
    try {
        const key = uuidv4();
        const createdAt = new Date();
        const { email, message } = req.body;
        await contract.submitTransaction('createForms', key, email, message, createdAt);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.updateForms = async function (req, res, contract) {
    try {
        const { key, email, message } = req.body;
        await contract.submitTransaction('updateForms', key, email, message);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// delete user
exports.deleteUsers = async function (req, res, contract) {
    try {
        await contract.submitTransaction('deleteForms', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
