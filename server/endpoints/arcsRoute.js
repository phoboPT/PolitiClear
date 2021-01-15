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

const verify = async (contract, data, creatorId) => {
    const { initialNode, finalNode } = data;
    const a = dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
    const b = dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
    const c = dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
    await Promise.all([a, b, c]);
    return Promise.resolve();
}
const getNodesDescription = async (contract, initialNode, finalNode, creatorId) => {
    const initial = contract.submitTransaction('readNodes', initialNode);
    const final = contract.submitTransaction('readNodes', finalNode);
    const creator = contract.submitTransaction('readUsers', creatorId);
    const res = await Promise.all(
        [initial, final, creator]
    );
    return Promise.resolve(res)
}
// create new form
exports.createArcs = async function (req, res, contract) {
    try {
        const { description, initialNode, finalNode } = req.body;
        let creatorId, initialNodeDescription, finalNodeDescription, creatorIdDescription;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }

        const key = uuidv4();
        const createdAt = new Date();

        await verify(contract, req.body, creatorId);

        //buscar as descricoes dos nodos
        const nodesDescriptions = await getNodesDescription(contract, initialNode, finalNode, creatorId);
        initialNodeDescription = JSON.parse(nodesDescriptions[0]).description;
        finalNodeDescription = JSON.parse(nodesDescriptions[1]).description;
        creatorIdDescription = JSON.parse(nodesDescriptions[2]).name;

        await contract.submitTransaction('createArcs', key, description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, creatorIdDescription, createdAt, 0);
        return { data: "Created" }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        if (req.body.key === "" || req.body.key === undefined) {
            return { error: "Key must be provided!" }
        }
        const { key, description } = req.body;

        await contract.submitTransaction('updateArcs', key, description || '', '');
        return { data: "Updated" }
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
        if (JSON.parse(await contract.submitTransaction('readArcs', req.headers.key)).totalVotes < 1) {
            const res = await deleteOneArc(contract, req.headers.key)
            JSON.parse(res[1]).forEach((votesData) => {
                if (votesData.Record.arcId === req.headers.key) {
                    contract.submitTransaction('deleteVotes', votesData.Key);
                }
            });
            return { data: "Deleted" }
        }
        return { error: "Delete denied! Already have votes!" }
    } catch (e) {
        return { error: e.message }
    }
};
