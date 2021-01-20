const { v4: uuidv4 } = require('uuid');
const dataVerifications = require('./functions/dataVerifications');
const { permissions } = require('./functions/permissions');
const jwt = require("jsonwebtoken");;

// search by key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readArcs', req.params.key);

        return { data: JSON.parse(response) };
    } catch (e) {
        return { error: e.message };
    }
};

const verify = async (contract, data) => {
    const { initialNode, finalNode } = data;
    const a = dataVerifications.verifyKeyExists(initialNode, 'Nodes', contract);
    const b = dataVerifications.verifyKeyExists(finalNode, 'Nodes', contract);
    await Promise.all([a, b]);
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
        const { description, initialNode, finalNode, token = "" } = req.body;
        const creatorId = await dataVerifications.verifyToken(contract, token, permissions[1]);

        await verify(contract, req.body);
        const key = uuidv4();

        //buscar as descricoes dos nodos
        const nodesData = await getNodesDescription(contract, initialNode, finalNode, creatorId);
        const initialNodeInfo = JSON.parse(nodesData[0]);
        const finalNodeInfo = JSON.parse(nodesData[1]);
        const creatorIdInfo = JSON.parse(nodesData[2]);

        await contract.submitTransaction('createArcs', key, description,
            initialNode, initialNodeInfo.description, initialNodeInfo.creatorId, initialNodeInfo.creatorIdDescription,
            initialNodeInfo.nodeType, initialNodeInfo.nodeTypeDescription, initialNodeInfo.createdAt, initialNodeInfo.updatedAt,
            finalNode, finalNodeInfo.description, finalNodeInfo.creatorId, finalNodeInfo.creatorIdDescription,
            finalNodeInfo.nodeType, finalNodeInfo.nodeTypeDescription, finalNodeInfo.createdAt, finalNodeInfo.updatedAt,
            creatorId, creatorIdInfo.name, 0);
        return { data: "Created" }
    } catch (e) {
        return { error: e.message }
    }
};

exports.updateArcs = async function (req, res, contract) {
    try {
        const { key, description, token } = req.body;
        if (key === "" || key === undefined) {
            return { error: "Key must be provided!" }
        }
        const creatorId = await dataVerifications.verifyToken(contract, token, permissions[1]);

        const creatorIdDescription = JSON.parse(await contract.submitTransaction('readUsers', creatorId)).name;
        const res = await contract.submitTransaction("queryByObjectType", "Votes");
        let aux = 0;
        JSON.parse(res).forEach((votesData) => {
            if (votesData.Record.arcId === key) {
                aux = 1;

            }
        });
        if (aux === 1) {
            return { error: 'Arc already have votes!' };
        }

        await contract.submitTransaction('updateArcs', key, description || '', '', creatorId, creatorIdDescription);
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
        const { key, token } = req.body;
        await dataVerifications.verifyToken(contract, token, permissions[0]);

        if (JSON.parse(await contract.submitTransaction('readArcs', key)).totalVotes < 1) {
            const res = await deleteOneArc(contract, key)
            JSON.parse(res[1]).forEach((votesData) => {
                if (votesData.Record.arcId === key) {
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
