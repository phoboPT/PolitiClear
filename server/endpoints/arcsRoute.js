const { v4: uuidv4 } = require('uuid');
const dataVerifications = require('./functions/dataVerifications');
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readArcs', req.params.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

const verify = async (contract,data,creatorId) => {
    const {  initialNode, finalNode } =data;
    console.log( initialNode);
    const a = dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
    const b = dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
    const c = dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
    await Promise.all(

        [a, b, c]

    );
    return Promise.resolve();
}
// create new form
exports.createArcs = async function (req, res, contract) {
    try {
        let creatorId;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        const key = uuidv4();
        const createdAt = new Date();
        const { description, initialNode, finalNode } = req.body;
        await verify(contract, req.body, creatorId)
        await contract.submitTransaction('createArcs', key, description, initialNode, finalNode, creatorId, createdAt, 0);
        return { data: JSON.parse(res) }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        const { key, description, initialNode, finalNode } = req.body;
        let creatorId;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        await contract.submitTransaction('updateArcs', key, description, initialNode||"", finalNode||"", creatorId||"", '');
        console.log(key,description);
        return { data: "Updated"}
    } catch (e) {
        return { error: e.message }
    }
};

const deleteOneArc = async (contract, key) => {
    const delArc = contract.submitTransaction('deleteArcs', key);
    const data = contract.submitTransaction("queryByObjectType", "Votes");
    const res = await Promise.all(
        [delArc, data]
    );
    return Promise.resolve(res)
}

// delete user
exports.deleteArcs = async function (req, res, contract) {
    try {
        const res = await deleteOneArc(contract, req.headers.key)
        JSON.parse(res[1]).forEach((votesData) => {
            if (votesData.Record.arcId === req.headers.key) {
                contract.submitTransaction('deleteVotes', votesData.Key);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};
