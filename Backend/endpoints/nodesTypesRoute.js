const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "readNodesTypes",
      req.params.key
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

// cria novo tipo
exports.createNodesTypes = async function (req, res, contract) {
  try {
    const { name, token } = req.body;

    const userID = jwt.verify(token, "MySecret");

    const key = uuidv4();
    const nodeType = {
      name,
      key,
      creatorId: userID.userId,
    };
    const response = await contract.submitTransaction(
      "createNodesTypes",
      JSON.stringify(nodeType)
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

exports.deleteNodesTypes = async function (req, res, contract) {
  try {
    if (req.body.key === "" || req.body.key === undefined) {
      return { error: "Key must be provided!" };
    }

    const response = await contract.submitTransaction(
      "deleteNodesTypes",
      req.body.key
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};
