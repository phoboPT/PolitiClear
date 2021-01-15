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
const getNodesDescription = async (contract, initialNode, finalNode) => {
    const initial = contract.submitTransaction('readNodes', initialNode);
    const final = contract.submitTransaction('readNodes', finalNode);
    const res = await Promise.all(
        [initial, final]
    );
    return Promise.resolve(res)
}
// create new form
exports.createArcs = async function (req, res, contract) {
    try {
        const { description, initialNode, finalNode } = req.body;
        let creatorId, initialNodeDescription, finalNodeDescription;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }

        const key = uuidv4();
        const createdAt = new Date();

        await verify(contract, req.body, creatorId);

        //buscar as descricoes dos nodos
        const nodesDescriptions = await getNodesDescription(contract, initialNode, finalNode);
        initialNodeDescription = JSON.parse(nodesDescriptions[0]).description;
        finalNodeDescription = JSON.parse(nodesDescriptions[1]).description;

        await contract.submitTransaction('createArcs', key, description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, createdAt, 0);
        return { data: "Created" }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        const { key, description, initialNode, finalNode } = req.body;
        let creatorId, initialNodeDescription, finalNodeDescription;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            creatorId = userID.userId;
        }
        if (initialNode !== "" && initialNode !== undefined && finalNode !== "" && finalNode !== undefined) {
            const nodesDescriptions = await getNodesDescription(contract, initialNode, finalNode);
            initialNodeDescription = JSON.parse(nodesDescriptions[0]).description;
            finalNodeDescription = JSON.parse(nodesDescriptions[1]).description;

        } else {
            if (initialNode !== "" && initialNode !== undefined) {
                const response = await contract.submitTransaction('readNodes', initialNode);
                initialNodeDescription = JSON.parse(response).description;
            }
            if (finalNode !== "" && finalNode !== undefined) {
                const response = await contract.submitTransaction('readNodes', finalNode);
                finalNodeDescription = JSON.parse(response).description;
            }
        }


        await contract.submitTransaction('updateArcs', key,
            description || "",
            initialNode || "",
            initialNodeDescription || "",
            finalNode || "",
            finalNodeDescription || "",
            creatorId, '');
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
