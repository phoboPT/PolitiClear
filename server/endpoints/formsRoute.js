// search by key
exports.getFormsByKey = async function (req, res, contract) {
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
        const { email, message } = req.body;
        await contract.submitTransaction('createForms', email, message);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
