const { v4: uuidv4 } = require("uuid");
const dataVerifications = require("./functions/dataVerifications");
const { permissions } = require("./functions/permissions");
const jwt = require("jsonwebtoken");

// search by key
exports.getByKey = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "readArcs",
      req.params.key
    );

    return { data: JSON.parse(response) };
  } catch (e) {
    return { error: e.message };
  }
};

const verify = async (contract, data) => {
  const { initialNode, finalNode } = data;
  const a = dataVerifications.verifyKeyExists(initialNode, "Nodes", contract);
  const b = dataVerifications.verifyKeyExists(finalNode, "Nodes", contract);
  await Promise.all([a, b]);
  return Promise.resolve();
};

const getNodesDescription = async (
  contract,
  initialNode,
  finalNode,
  creatorId
) => {
  const initial = contract.submitTransaction("readNodes", initialNode);
  const final = contract.submitTransaction("readNodes", finalNode);
  const creator = contract.submitTransaction("readUsers", creatorId);
  const res = await Promise.all([initial, final, creator]);
  return Promise.resolve(res);
};
// create new form
exports.createArcs = async function (req, res, contract) {
  try {
    const { description, initialNode, finalNode, token } = req.body;
    const creatorId = await dataVerifications.verifyToken(
      contract,
      token,
      permissions[1]
    );

    await verify(contract, req.body);
    const key = uuidv4();

    //buscar as descricoes dos nodos
    const nodesData = await getNodesDescription(
      contract,
      initialNode,
      finalNode,
      creatorId
    );
    const initialNodeInfo = JSON.parse(nodesData[0]);
    const finalNodeInfo = JSON.parse(nodesData[1]);
    const creatorIdInfo = JSON.parse(nodesData[2]);

    const newArc = {
      key,
      description,
      initialNode,
      initialNodeDescription: initialNodeInfo.description,
      initialNodeCreatorId: initialNodeInfo.creatorId,
      initialNodeCreatorIdDescription: initialNodeInfo.creatorIdDescription,
      initialNodeNodeType: initialNodeInfo.nodeType,
      initialNodeNodeTypeDescription: initialNodeInfo.nodeTypeDescription,
      initialNodeCreatedAt: initialNodeInfo.createdAt,
      initialNodeUpdatedAt: initialNodeInfo.updatedAt,
      finalNode,
      finalNodeDescription: finalNodeInfo.description,
      finalNodeCreatorId: finalNodeInfo.creatorId,
      finalNodeCreatorIdDescription: finalNodeInfo.creatorIdDescription,
      finalNodeNodeType: finalNodeInfo.nodeType,
      finalNodeNodeTypeDescription: finalNodeInfo.nodeTypeDescription,
      finalNodeCreatedAt: finalNodeInfo.createdAt,
      finalNodeUpdatedAt: finalNodeInfo.updatedAt,
      creatorId,
      creatorIdDescription: creatorIdInfo.name,
      totalVotes: 0,
    };

    const response = await contract.submitTransaction(
      "createArcs",
      JSON.stringify(newArc)
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

const updatePromisses = async (contract, creatorId) => {
  const creatorIdDescription = contract.submitTransaction(
    "readUsers",
    creatorId
  );

  const votes = contract.submitTransaction("queryByObjectType", "Votes");

  const res = await Promise.all([creatorIdDescription, votes]);
  return Promise.resolve(res);
};

exports.updateArcs = async function (req, res, contract) {
  try {
    const { key, description, token } = req.body;
    if (key === "" || key === undefined) {
      return { error: "Key must be provided!" };
    }
    const creatorId = jwt.verify(token, "MySecret").userId;
    const data = await updatePromisses(contract, creatorId);
    const creatorIdDescription = JSON.parse(data[0]).name;
    const votes = JSON.parse(data[1]);
    let aux = 0;
    votes.forEach((votesData) => {
      if (votesData.Record.arcId === key) {
        aux = 1;
        return;
      }
    });
    if (aux === 1) {
      return { error: "Arc already have votes!" };
    }

    const newArc = {
      key,
      description,
      creatorId,
      creatorIdDescription,
    };
    const response = await contract.submitTransaction(
      "updateArcs",
      JSON.stringify(newArc)
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

const deleteOneArc = async (contract, key) => {
  const delArc = contract.submitTransaction("deleteArcs", key);
  const data = contract.submitTransaction("queryByObjectType", "Votes");
  const res = await Promise.all([delArc, data]);
  return Promise.resolve(res);
};

// delete user
exports.deleteArcs = async function (req, res, contract) {
  try {
    const { key, token } = req.body;
    console.log(key, token);
    await dataVerifications.verifyToken(contract, token, permissions[0]);

    if (
      JSON.parse(await contract.submitTransaction("readArcs", key)).totalVotes <
      1
    ) {
      const res = await deleteOneArc(contract, key);
      JSON.parse(res[1]).forEach((votesData) => {
        if (votesData.Record.arcId === key) {
          contract.submitTransaction("deleteVotes", votesData.Key);
        }
      });
      return { data: "Deleted" };
    }
    return { error: "Delete denied! Already have votes!" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.userArcs = async function (req, res, contract) {
  try {
    const { key } = req.headers;
    if (!key) {
      throw new Error("Your token is invalid");
    }
    const creatorId = await dataVerifications.verifyToken(contract, key);

    const buffer1 = await contract.submitTransaction(
      "queryByObjectType",
      "Arcs"
    );
    const asset = JSON.parse(buffer1.toString());
    const result = asset.filter((item) => {
      return item.Record.creatorId === creatorId;
    });

    return result;
  } catch (e) {
    return { error: e.message };
  }
};
