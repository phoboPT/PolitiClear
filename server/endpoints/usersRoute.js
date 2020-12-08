const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
// search by key
exports.getByKey = async (req, res, contract) => {
    try {
        const response = await contract.submitTransaction('readUsers', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// search by name
exports.getByName = async (req, res, contract) =>{
    try {
        const data = await contract.submitTransaction('queryByObjectType', 'Users');
        let user = {};
        JSON.parse(data).forEach(userData => {
            if (userData.Record.email === req.params.name) {
                user = {
                    ...user,
                    user: userData.Record
                };
            }
        });
        res.status(200).send(user);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Create user
exports.createUsers = async (req, res, contract) =>{
    try {
        const { name, email, password } = req.body;
        const key = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        await contract.submitTransaction('createUsers', key, name, email, hashedPassword);
        const token = jwt.sign(
            {
                userId: key
            },
            'MySecret'
        );
        res.token = token;
        res.send({ token: token });
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// Update User
exports.updateUsers = async (req, res, contract)=> {
    try {
        const {
            id, name, email, password
        } = req.body;
        await contract.submitTransaction('updateUsers', id, name, email, password);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// delete user
exports.deleteUsers = async (req, res, contract) =>{
    try {
        await contract.submitTransaction('deleteUsers', req.params.key);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.me = async (req, res, contract) => {
    console.log(req.body.token);
    console.log('hey');
    const key = jwt.verify(req.body.token, 'MySecret');
    console.log(key);
    try {
        const response = await contract.submitTransaction('readUsers', key.userId);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};
