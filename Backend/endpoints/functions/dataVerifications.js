//verificar se existem keys antes de inserir
const jwt = require("jsonwebtoken");
const { permissions } = require("./permissions");
/**
 *
 * @param {Id of the object} key
 * @param {Type of data of the object} dataType
 * @param {Contract to the network where the db is stored} contract
 */
exports.verifyKeyExists = async function (key, dataType, contract) {
  const query = await contract.submitTransaction("queryByObjectType", dataType);
  let data;
  JSON.parse(query).forEach((dataRecord) => {
    if (dataRecord.Key === key) {
      data = { ...data, data: dataRecord.Key };
    }
  });
  if (!data) {
    throw new Error(`Error! The ${dataType} ${key} does not exists`);
  }
  return data;
};

exports.verifyNameAlreadyExists = async function (name, dataType, contract) {
  const query = await contract.submitTransaction("queryByObjectType", dataType);
  let data;
  JSON.parse(query).forEach((dataRecord) => {
    if (dataRecord.Record.name === name) {
      data = { ...data, data: dataRecord.Record };
    }
  });
  if (data) {
    throw new Error(`Error! The ${dataType} ${name} already exists`);
  }
  return data;
};

/**
 * 
 * Accepts the user token, the disered permissions to check and the network connection.
 * 
 * Returns the user id if the token is valid, otherwise returns a error
 * 
 * @param {any} contract Network connection
 * @param {string} token User token for verification
 * @param {string} permissionRequired Permission that will be tested against the user

 */
exports.verifyToken = async function (contract, token, permissionRequired) {
  if (token) {
    const userID = jwt.verify(token, "MySecret");
    const permission = JSON.parse(
      await contract.submitTransaction("readUsers", userID.userId)
    ).permission;

    if (
      permissionRequired === permissions[0] &&
      permission !== permissions[0]
    ) {
      throw new Error("Error! You do not have administrator permissions!");
    }
    if (
      permissionRequired === permissions[1] &&
      permission !== permissions[1] &&
      permission !== permissions[0]
    ) {
      throw new Error("Error! You do not have permissions!");
    }

    return userID.userId;
  }
  throw new Error("Error! Invalid or null Token");
};
