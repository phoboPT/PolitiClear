const { v4: uuidv4 } = require("uuid");
const dataVerifications = require("./functions/dataVerifications");

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
    const { name } = req.body;
    const key = uuidv4();
    const nodeType = {
      name,
      key,
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
    if (req.headers.key === "" || req.headers.key === undefined) {
      return { error: "Key must be provided!" };
    }

    const response = await contract.submitTransaction(
      "deleteNodesTypes",
      req.headers.key
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};
