//verificar se existem keys antes de inserir
const jwt = require("jsonwebtoken");

exports.verifyKeyExists = async function (key, dataType, contract) {
    const query = await contract.submitTransaction("queryByObjectType", dataType);
    let data;
    JSON.parse(query).forEach((dataRecord) => {
        if (dataRecord.Key === key) {
            data = { ...data, data: dataRecord.Key, };
        }
    });
    if (!data) {
        throw new Error(`Error! The ${dataType} ${key} does not exists`);
    }
    return data;
}

exports.verifyNameAlreadyExists = async function (name, dataType, contract) {
    const query = await contract.submitTransaction("queryByObjectType", dataType);
    let data;
    JSON.parse(query).forEach((dataRecord) => {
        if (dataRecord.Record.name === name) {
            data = { ...data, data: dataRecord.Record, };
        }
    });
    if (data) {
        throw new Error(`Error! The ${dataType} ${name} already exists`);
    }
    return data;
}

exports.verifyToken = async function(token) {
    if (token) {
        const userID = jwt.verify(token, "MySecret");
        return userID.userId;
    }
    throw new Error('Error! Invalid or null Token');
}