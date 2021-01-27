const { v4: uuidv4 } = require("uuid");
const dataVerifications = require("./functions/dataVerifications");
const permissions = require("./functions/permissions");
// search by key
exports.getByKey = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "readForms",
      req.params.key
    );
    return { data: JSON.parse(response) };
  } catch (e) {
    return { error: e.message };
  }
};

// create new form
exports.createForms = async function (req, res, contract) {
  try {
    const { token, message, email = "", upgradeRequest = false } = req.body;

    let createdBy = "";
    let creatorByDescription = "";
    if (token) {
      createdBy = await dataVerifications.verifyToken(contract, token);
      creatorByDescription = JSON.parse(
        await contract.submitTransaction("readUsers", createdBy)
      ).name;
    }
    const key = uuidv4();

    const newForm = {
      key,
      email,
      message,
      status: "Open",

      createdBy,
      creatorByDescription,
      upgradeRequest,
    };
    const response = await contract.submitTransaction(
      "createForms",
      JSON.stringify(newForm)
    );
    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

exports.updateForms = async function (req, res, contract) {
  try {
    const { key, status, response } = req.body;
    const newForm = {
      key,
      status,
      response,
    };
    const res = await contract.submitTransaction(
      "updateForms",
      JSON.stringify(newForm)
    );
    return JSON.parse(res);
  } catch (e) {
    return { error: e.message };
  }
};

// delete user
exports.deleteForms = async function (req, res, contract) {
  try {
    await contract.submitTransaction("deleteForms", req.headers.key);
    return { data: "Deleted" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.getFormsOpen = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "queryByObjectType",
      "Forms"
    );
    let data = [];

    JSON.parse(response).forEach((arcsData) => {
      if (arcsData.Record.status === "Open") {
        data.push(arcsData);
      }
    });
    return { data: data };
  } catch (e) {
    return { error: e.message };
  }
};
