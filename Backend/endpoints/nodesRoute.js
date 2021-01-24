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
    let nodeTypeDescription = await contract.submitTransaction(
      "readNodesTypes",
      nodeTypeId
    );
    nodeTypeDescription = JSON.parse(nodeTypeDescription).name;

    await contract.submitTransaction(
      "createNodes",
      key,
      description,
      creatorId,
      creatorIdDescription,
      nodeTypeId,
      nodeTypeDescription
    );
    await contract.submitTransaction("updateNodesTypes", {
      key: nodeTypeId,
      isUsed: 1,
    });

    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};

// Update User
exports.updateNodes = async function (req, res, contract) {
  try {
    const { key, description, nodeType, token } = req.body;
    const creatorId = await dataVerifications.verifyToken(
      contract,
      token,
      permissions[1]
    );
    const creatorIdDescription = JSON.parse(
      await contract.submitTransaction("readUsers", creatorId)
    ).name;

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

    await contract.submitTransaction(
      "updateNodes",
      key,
      description || "",
      nodeType || "",
      nodeTypeDescription || "",
      creatorId,
      creatorIdDescription
    );

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
      if (existNode === 1) {
        await contract.submitTransaction("updateNodesTypes", nodeTypeBefore, 1);
      } else {
        await contract.submitTransaction("updateNodesTypes", nodeTypeBefore, 0);
      }
    }

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
    console.log(key);
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
              edge.Record.finalNode,
              edge.Record.finalNodeDescription,
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
                edge.Record.finalNode,
                edge.Record.finalNodeDescription,
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
        nodo.push([item[1], item[2]]);
      }
      existeNodo = 0;

      for (let i = 0; i < nodo.length; i++) {
        if (nodo[i][0] === item[3]) {
          existeNodo = 1;
          break;
        }
      }
      if (existeNodo !== 1) {
        nodo.push([item[3], item[4]]);
      }
      existeNodo = 0;
    });

    return { arcs: query, nodes: nodo };
  } catch (e) {
    return { error: e.error };
  }
};

//..................................................................//

// exports.getRelations = async function (req, res, contract) {
//   try {
//     const { key } = req.headers;
//     const edges = JSON.parse(await contract.submitTransaction("queryByObjectType", "Arcs"));
//     let arco = [];
//     let nodo = [];
//     let existe = 0
//     let existeNodo = 0;
//     var stack = [];

//     const query = procurarAdjacente(key)

//     function procurarAdjacente(key) {
//       //percorre todos arcos
//       edges.forEach((edge) => {
//         //verifica se arco tem inicial = key
//         if (key === edge.Record.initialNode) {
//           //verifica se o arco já foi adicionado
//           for (let i = 0; i < arco.length; i++) {
//             if (edge.Key === arco[i][0]) {
//               existe = 1;
//               break;
//             }
//           }
//           //se nao existir adiciona nova iteração
//           if (existe !== 1) {
//             stack.push(edge.Record.initialNode)
//             arco.push([edge.Key, edge.Record.initialNode, edge.Record.initialNodeDescription, edge.Record.finalNode, edge.Record.finalNodeDescription])
//             procurarAdjacente(edge.Record.finalNode)
//           }
//           existe = 0;
//         }
//       })
//       const anterior = stack.pop()
//       if (anterior) {
//         procurarAdjacente(anterior)
//       }
//       return arco;
//     }

//     arco.forEach((item) => {
//       for (let i = 0; i < nodo.length; i++) {
//         if (nodo[i][0] === item[1]) {
//           existeNodo = 1; break;
//         }
//       }
//       if (existeNodo !== 1) {
//         nodo.push([item[1], item[2]])
//       }
//       existeNodo = 0;

//       for (let i = 0; i < nodo.length; i++) {
//         if (nodo[i][0] === item[3]) {
//           existeNodo = 1; break;
//         }
//       }
//       if (existeNodo !== 1) {
//         nodo.push([item[3], item[4]])
//       }
//       existeNodo = 0;

//     })

//     return { arcs: query, nodes: nodo }
//   } catch (e) {
//     return { error: e.error };
//   }
// };
