const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

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
    const { token, userKey, message, email = "", upgradeRequest = false, } = req.body;
    let createdBy = userKey;
    let creatorByDescription = "";
    if (token) {
      createdBy = await dataVerifications.verifyToken(contract, token, permissions[0]);
      creatorByDescription = JSON.parse(await contract.submitTransaction("readUsers", createdBy)).name;
    }
    const key = uuidv4();
    const createdAt = new Date();
    await contract.submitTransaction("createForms", key, email, message, createdAt, "Open", "", createdBy, creatorByDescription, upgradeRequest);
    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.updateForms = async function (req, res, contract) {
  try {
    const { key, status = "", response = "" } = req.body;
    console.log(key, status, response);

    await contract.submitTransaction("updateForms", key, status, response);
    return { data: "Updated" };
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
