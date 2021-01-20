const { v4: uuidv4 } = require("uuid");
const dataVerifications = require("./functions/dataVerifications");
const jwt = require("jsonwebtoken");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "readNodes",
      req.params.key
    );
    return { data: JSON.parse(response) };
  } catch (e) {
    return { error: e.message };
  }
};

// cria novo tipo
exports.createNodes = async function (req, res, contract) {
  try {
    const { description, nodeType, token } = req.body;
    const creatorId = await dataVerifications.verifyToken(contract, token, permissions[1]);
    await dataVerifications.verifyKeyExists(nodeType, "NodesTypes", contract);

    const key = uuidv4();

    let creatorIdDescription = await contract.submitTransaction(
      "readUsers",
      creatorId
    );
    creatorIdDescription = JSON.parse(creatorIdDescription).name;
    let nodeTypeDescription = await contract.submitTransaction(
      "readNodesTypes",
      nodeType
    );
    nodeTypeDescription = JSON.parse(nodeTypeDescription).name;

    await contract.submitTransaction(
      "createNodes",
      key,
      description,
      creatorId,
      creatorIdDescription,
      nodeType,
      nodeTypeDescription
    );
    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};

// Update User
exports.updateNodes = async function (req, res, contract) {
  try {
    const { key, description, nodeType, token } = req.body;
    const creatorId = await dataVerifications.verifyToken(contract, token, permissions[1]);
    const creatorIdDescription = JSON.parse(
      await contract.submitTransaction("readUsers", creatorId)
    ).name;
    let nodeTypeDescription;
    if (nodeType !== "" && nodeType !== undefined) {
      await dataVerifications.verifyKeyExists(nodeType, "NodesTypes", contract);
      nodeTypeDescription = JSON.parse(
        await contract.submitTransaction("readNodesTypes", nodeType)
      ).name;
    }

    await contract.submitTransaction(
      "updateNodes",
      key,
      description || "",
      nodeType || "",
      nodeTypeDescription || "",
      creatorId,
      creatorIdDescription
    );
    return { data: "Updated" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.deleteNodes = async function (req, res, contract) {
  try {
    const { token, key } = req.body;
    await dataVerifications.verifyToken(contract, token, permissions[0]);
    const response = await contract.submitTransaction(
      "queryByObjectType",
      "Arcs"
    );
    //verifica se existem arcos com votos positivos
    for (let i = 0; i < JSON.parse(response).length; i++) {
      if (
        JSON.parse(response)[i].Record.finalNode === key ||
        JSON.parse(response)[i].Record.initialNode === key
      ) {
        if (JSON.parse(response)[i].Record.totalVotes > 0) {
          return { error: "Delete denied! Arcs already have votes" };
        }
      }
    }
    //remove nodo e arcos caso não haja votos em nenhum deles
    for (let i = 0; i < JSON.parse(response).length; i++) {
      if (
        JSON.parse(response)[i].Record.finalNode === key ||
        JSON.parse(response)[i].Record.initialNode === key
      ) {
        await contract.submitTransaction(
          "deleteArcs",
          JSON.parse(response)[i].Key
        );
      }
    }
    await contract.submitTransaction("deleteNodes", key);

    return { data: "Deleted" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.search = async function (req, res, contract) {
  try {
    const { description } = req.headers;
    const res1 = await contract.submitTransaction("queryByObjectType", "Nodes");
    const res = JSON.parse(res1);
    const key = [];
    for (let i = 0; i < res.length; i++) {
      if (
        res[i].Record.description
          .toLowerCase()
          .includes(description.toLowerCase())
      ) {
        key.push(res[i]);
      }
    }
    return key;
  } catch (e) {
    return { error: e.message };
  }
};

exports.searchNodes = async function (req, res, contract) {
  try {
    console.log("hey");
    const { key } = req.headers;
    const allArcs = await contract.submitTransaction(
      "queryByObjectType",
      "Arcs"
    );
    const allNodes = await contract.submitTransaction(
      "queryByObjectType",
      "Nodes"
    );

    const arcos = JSON.parse(allArcs);
    const nodes = JSON.parse(allNodes);
    const filteredArcs = [];

    arcos.forEach((arco) => {
      if (arco.Record.initialNode === key || arco.Record.finalNode === key) {
        filteredArcs.push(arco);
      }
    });
    const final = [];
    filteredArcs.forEach((arco) => {
      const finalData = {};
      nodes.forEach((node) => {
        if (node.Key === arco.Record.initialNode) {
          finalData[arco.Key] = { ...finalData[arco.Key], initialNode: node };
        }
        if (node.Key === arco.Record.finalNode) {
          console.log(arco, node);
          finalData[arco.Key] = { ...finalData[arco.Key], finalNode: node };
        }
      });
      if (finalData[arco.Key]) {
        const data = {
          arc: arco,
          ...finalData[arco.Key],
        };
        final.push(data);
      }
    });

    return { data: final };
  } catch (e) {
    return { error: e.message };
  }
};

exports.userNodes = async function (req, res, contract) {
  try {
    const { key } = req.headers;
    if (!key) {
      throw new Error("Your token is invalid");
    }
    const creatorId = await dataVerifications.verifyToken(contract, key,);

    const buffer1 = await contract.submitTransaction("queryByObjectType", "Nodes");
    const asset = JSON.parse(buffer1.toString());
    const result = asset.filter((item) => {
      return item.Record.creatorId === creatorId;
    });

    return result;
  } catch (e) {
    return { error: e.message };
  }
};

exports.getRelations = async function (req, res, contract) {
  try {
    console.log("hey");
    const { key } = req.headers;
    const arcos = await contract.submitTransaction("queryByObjectType", "Arcs");
    const nodes = await contract.submitTransaction(
      "queryByObjectType",
      "Nodes"
    );
    let neededNodes = [];
    let nodesDetails = [];

    // lista de nodos que tem ligações
    JSON.parse(arcos).forEach((arco) => {
      let aux = 0;

      neededNodes.forEach((item) => {
        if (arco.Record.initialNode === item) {
          aux = 1;
        }
      });

      if (aux === 0) {
        neededNodes.push(arco.Record.initialNode);
      }
      aux = 0;

      neededNodes.forEach((item) => {
        if (arco.Record.finalNode === item) {
          aux = 1;
        }
      });
      if (aux === 0) {
        neededNodes.push(arco.Record.finalNode);
      }
    });
    //adiciona os nodos em detalhe
    JSON.parse(nodes).forEach((nodo) => {
      neededNodes.forEach((item) => {
        if (nodo.Key === item) {
          nodesDetails.push(nodo);
        }
      });
    });

    let arcsByKey = [];
    JSON.parse(arcos).forEach((arco) => {
      if (arco.Record.initialNode === key) {
        arcsByKey.push(arco.Key);
      }
    });
    arcsByKey.forEach((arc) => { });

    return { nodes: nodesDetails, arcs: JSON.parse(arcos) };
  } catch (e) {
    return { error: e.error };
  }
};
