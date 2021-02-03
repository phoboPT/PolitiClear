const { v4: uuidv4 } = require("uuid");
const dataVerifications = require("./functions/dataVerifications");
const { permissions } = require("./functions/permissions");

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
    const { description, nodeTypeId, token } = req.body;
    const creatorId = await dataVerifications.verifyToken(
      contract,
      token,
      permissions[1]
    );
    await dataVerifications.verifyKeyExists(nodeTypeId, "NodesTypes", contract);

    const key = uuidv4();

    let creatorIdDescription = await contract.submitTransaction(
      "readUsers",
      creatorId
    );
    creatorIdDescription = JSON.parse(creatorIdDescription).name;
    const nodeTypeDescription = await contract.submitTransaction(
      "readNodesTypes",
      nodeTypeId
    );

    const newNode = {
      key,
      description,
      creatorId,
      creatorIdDescription,
      nodeTypeId,
      nodeTypeDescription: JSON.parse(nodeTypeDescription).data.name,
    };
    await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    await contract.submitTransaction(
      "updateNodesTypes",
      JSON.stringify({
        key: nodeTypeId,
        isUsed: 1,
      })
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
    const newNode = {
      key,
      description,
      nodeType,
    };
    const creatorId = await dataVerifications.verifyToken(
      contract,
      token,
      permissions[1]
    );
    newNode.creatorId = creatorId;
    const creatorIdDescription = JSON.parse(
      await contract.submitTransaction("readUsers", creatorId)
    ).name;
    newNode.creatorIdDescription = creatorIdDescription;

    let nodeTypeDescription, nodeTypeBefore;
    if (nodeType !== "" && nodeType !== undefined) {
      await dataVerifications.verifyKeyExists(nodeType, "NodesTypes", contract);
      nodeTypeDescription = JSON.parse(
        await contract.submitTransaction("readNodesTypes", nodeType)
      ).name;

      nodeTypeBefore = JSON.parse(
        await contract.submitTransaction("readNodes", key)
      ).nodeType;
    }

    //verificar se existem nodes com o mesmo nodeType
    if (nodeTypeBefore !== "" && nodeTypeBefore !== undefined) {
      let existNode = 0;
      const existsNodesByType = JSON.parse(
        await contract.submitTransaction("queryByObjectType", "Nodes")
      );
      existsNodesByType.forEach((item) => {
        if (item.Record.nodeType === nodeTypeBefore) {
          existNode = 1;
        }
      });

      const newNodeType = {
        key: nodeTypeBefore,
      };
      if (existNode === 1) {
        newNodeType.isUsed = 1;
        await contract.submitTransaction(
          "updateNodesTypes",
          JSON.stringify(newNodeType)
        );
      } else {
        newNodeType.isUsed = 0;
        await contract.submitTransaction(
          "updateNodesTypes",
          JSON.stringify(newNodeType)
        );
      }
    }
    newNode.nodeTypeDescription = nodeTypeDescription;
    const response = await contract.submitTransaction(
      "updateNodes",
      JSON.stringify(newNode)
    );

    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

exports.deleteNodes = async function (req, res, contract) {
  try {
    const { token, key } = req.body;
    await dataVerifications.verifyToken(contract, token, permissions[0]);
    const arcs = await contract.submitTransaction("queryByObjectType", "Arcs");
    const response = JSON.parse(arcs);
    //verifica se existem arcos com votos positivos
    for (let i = 0; i < response.length; i++) {
      if (
        response[i].Record.finalNode === key ||
        response[i].Record.initialNode === key
      ) {
        if (response[i].Record.totalVotes > 0) {
          return { error: "Delete denied! Arcs already have votes" };
        }
      }
    }
    //remove nodo e arcos caso não haja votos em nenhum deles
    for (let i = 0; i < response.length; i++) {
      if (
        response[i].Record.finalNode === key ||
        response[i].Record.initialNode === key
      ) {
        await contract.submitTransaction("deleteArcs", response[i].Key);
      }
    }

    const nodeType = JSON.parse(
      await contract.submitTransaction("readNodes", key)
    ).nodeType;

    await contract.submitTransaction("deleteNodes", key);

    //verificar se existem nodes com o mesmo nodeType
    let existNode = 0;
    const existsNodesByType = JSON.parse(
      await contract.submitTransaction("queryByObjectType", "Nodes")
    );
    existsNodesByType.forEach((item) => {
      if (item.Record.nodeType === nodeType) {
        existNode = 1;
      }
    });
    if (existNode === 1) {
      await contract.submitTransaction("updateNodesTypes", nodeType, 1);
    } else {
      await contract.submitTransaction("updateNodesTypes", nodeType, 0);
    }

    return { data: "Deleted" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.search = async function (req, res, contract) {
  try {
    const { search } = req.headers;
    const res1 = await contract.submitTransaction("queryByObjectType", "Nodes");
    const res = JSON.parse(res1);
    const key = [];
    for (let i = 0; i < res.length; i++) {
      if (
        res[i].Record.description.toLowerCase().includes(search.toLowerCase())
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
    const { key } = req.headers;
    const edges = JSON.parse(
      await contract.submitTransaction("queryByObjectType", "Arcs")
    );
    const arco = [];
    const nodo = [];
    let existeNodo;

    edges.forEach((edge) => {
      if (edge.Record.initialNode === key || edge.Record.finalNode === key) {
        arco.push([
          edge.Key,
          edge.Record.initialNode,
          edge.Record.initialNodeDescription,
          edge.Record.initialNodeNodeTypeDescription,
          edge.Record.finalNode,
          edge.Record.finalNodeDescription,
          edge.Record.finalNodeNodeTypeDescription,
          edge.Record.description,
          edge.Record.createdAt,
          edge.Record.totalVotes,
          edge.Record.creatorId,
          edge.Record.creatorIdDescription,
        ]);
      }
    });

    arco.forEach((item) => {
      for (let i = 0; i < nodo.length; i++) {
        if (nodo[i][0] === item[1]) {
          existeNodo = 1;
          break;
        }
      }
      if (existeNodo !== 1) {
        nodo.push([item[1], item[2], item[3], item[0]]);
      }
      existeNodo = 0;

      for (let i = 0; i < nodo.length; i++) {
        if (nodo[i][0] === item[4]) {
          existeNodo = 1;
          break;
        }
      }
      if (existeNodo !== 1) {
        nodo.push([item[4], item[5], item[6]]);
      }
      existeNodo = 0;
    });

    return { arcs: arco, nodes: nodo };
  } catch (e) {
    return { error: e.message };
  }
};

//-----------------------------------------------------------------

exports.getRelations = async function (req, res, contract) {
  try {
    const { key } = req.headers;
    const edges = JSON.parse(
      await contract.submitTransaction("queryByObjectType", "Arcs")
    );
    const arco = [];
    const nodo = [];
    let existe = 0,
      existe1 = 0;
    let existeNodo = 0;
    const stack = [];
    const query = procurarAdjacente(key);

    function procurarAdjacente(key) {
      //percorre todos arcos
      edges.forEach((edge) => {
        //verifica se arco tem inicial = key
        if (key === edge.Record.initialNode) {
          //verifica se o arco já foi adicionado
          for (let i = 0; i < arco.length; i++) {
            if (edge.Key === arco[i][0]) {
              existe = 1;
              break;
            }
          }
          //se nao existir adiciona nova iteração
          if (existe !== 1) {
            stack.push(edge.Record.initialNode);
            arco.push([
              edge.Key,
              edge.Record.initialNode,
              edge.Record.initialNodeDescription,
              edge.Record.initialNodeNodeTypeDescription,
              edge.Record.finalNode,
              edge.Record.finalNodeDescription,
              edge.Record.finalNodeNodeTypeDescription,
              edge.Record.description,
              edge.Record.createdAt,
              edge.Record.totalVotes,
              edge.Record.creatorId,
              edge.Record.creatorIdDescription,
            ]);
            procurarAdjacente(edge.Record.finalNode);
          }
          existe = 0;
        }
      });
      procurarAdjacenteInverso(key);

      function procurarAdjacenteInverso(key) {
        edges.forEach((edge) => {
          if (key === edge.Record.finalNode) {
            for (let i = 0; i < arco.length; i++) {
              if (edge.Key === arco[i][0]) {
                existe1 = 1;
                break;
              }
            }
            if (existe1 !== 1) {
              stack.push(edge.Record.initialNode);
              arco.push([
                edge.Key,
                edge.Record.initialNode,
                edge.Record.initialNodeDescription,
                edge.Record.initialNodeNodeTypeDescription,
                edge.Record.finalNode,
                edge.Record.finalNodeDescription,
                edge.Record.finalNodeNodeTypeDescription,
                edge.Record.description,
                edge.Record.createdAt,
                edge.Record.totalVotes,
                edge.Record.creatorId,
                edge.Record.creatorIdDescription,
              ]);
              procurarAdjacenteInverso(edge.Record.initialNode);
            }
            existe1 = 0;
          }
        });
      }

      const anterior = stack.pop();
      if (anterior) {
        procurarAdjacente(anterior);
      }
      return arco;
    }

    arco.forEach((item) => {
      for (let i = 0; i < nodo.length; i++) {
        if (nodo[i][0] === item[1]) {
          existeNodo = 1;
          break;
        }
      }
      if (existeNodo !== 1) {
        nodo.push([item[1], item[2], item[3], item[0]]);
      }
      existeNodo = 0;

      for (let i = 0; i < nodo.length; i++) {
        if (nodo[i][0] === item[4]) {
          existeNodo = 1;
          break;
        }
      }
      if (existeNodo !== 1) {
        nodo.push([item[4], item[5], item[6]]);
      }
      existeNodo = 0;
    });
    return { arcs: query, nodes: nodo };
  } catch (e) {
    return { error: e.error };
  }
};

// exports.searchNodes = async function (req, res, contract) {
//   try {
//     const { key } = req.headers;
//     const allArcs = await contract.submitTransaction(
//       "queryByObjectType",
//       "Arcs"
//     );
//     const allNodes = await contract.submitTransaction(
//       "queryByObjectType",
//       "Nodes"
//     );

//     const arcos = JSON.parse(allArcs);
//     const nodes = JSON.parse(allNodes);
//     const filteredArcs = [];

//     arcos.forEach((arco) => {
//       if (arco.Record.initialNode === key || arco.Record.finalNode === key) {
//         filteredArcs.push(arco);
//       }
//     });
//     const final = [];
//     filteredArcs.forEach((arco) => {
//       const finalData = {};
//       nodes.forEach((node) => {
//         if (node.Key === arco.Record.initialNode) {
//           finalData[arco.Key] = { ...finalData[arco.Key], initialNode: node };
//         }
//         if (node.Key === arco.Record.finalNode) {
//           console.log(arco, node);
//           finalData[arco.Key] = { ...finalData[arco.Key], finalNode: node };
//         }
//       });
//       if (finalData[arco.Key]) {
//         const data = {
//           arc: arco,
//           ...finalData[arco.Key],
//         };
//         final.push(data);
//       }
//     });
//     console.log(final);
//     return { data: final };
//   } catch (e) {
//     return { error: e.message };
//   }
// };
