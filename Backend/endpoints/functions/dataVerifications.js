//verificar se existem keys antes de inserir
const jwt = require("jsonwebtoken");
const { permissions } = require('./permissions')

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

exports.verifyToken = async function (contract, token, admin) {
    if (token) {
        const userID = jwt.verify(token, "MySecret");
        const permission = JSON.parse(await contract.submitTransaction("readUsers", userID.userId)).permission;

        if(admin==='ADMIN' && permission !== permissions[0]) {
            throw new Error('Error! You do not have administrator permissions!');
        }
        if (permission !== permissions[0] && permission !== permissions[1]) {
            throw new Error('Error! You do not have permissions!');
        }
        return userID.userId;
    }
    throw new Error('Error! Invalid or null Token');
}