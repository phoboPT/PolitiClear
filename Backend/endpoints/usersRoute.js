const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dataVerifications = require('./functions/dataVerifications');
// search by key
exports.getByKey = async (req, res, contract) => {
  try {
    const response = await contract.submitTransaction(
      "readUsers",
      req.params.key
    );
    const parsedData = JSON.parse(response);
    delete parsedData["password"];
    return { data: parsedData };
  } catch (e) {
    return { error: e.message };
  }
};

// search by name
exports.getByName = async (req, res, contract) => {
  try {
    const data = await contract.submitTransaction("queryByObjectType", "Users");
    let user = {};
    JSON.parse(data).forEach((userData) => {
      if (userData.Record.email === req.params.name) {
        user = {
          ...user,
          user: userData.Record,
        };
      }
    });
    delete user["password"];
    return { data: JSON.parse(user) };
  } catch (e) {
    return { error: e.message };
  }
};

// Create user
exports.createUsers = async (req, res, contract) => {
  try {
    const { name, email, password, permission = "" } = req.body;
    const user = await contract.submitTransaction("queryByObjectType", "Users");
    // verify if there is already an email
    let users;
    JSON.parse(user).forEach((userData) => {
      if (userData.Record.email === email) {
        users = {
          ...users,
          users: userData.Record,
        };
      }
    });
    // if exists throw error
    if (users) {
      return { error: `The email: ${email} already exist` };
    }
    const key = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await contract.submitTransaction("createUsers", key, name, email, hashedPassword, permission);
    const token = jwt.sign({ userId: key, }, "MySecret");

    res.token = token;
    return { data: token };
  } catch (e) {
    return { error: e.message };
  }
};

// Update User
exports.updateUsers = async (req, res, contract) => {
  try {
    const { key, token, name = "", oldPassword = "", newPassword = "", permission = "" } = req.body;
    let updaterId, id;
    if (key) {
      updaterId = await dataVerifications.verifyToken(contract, token, permissions[0]);
      id = key;
    } else {
      updaterId = await dataVerifications.verifyToken(contract, token,);
      id = updaterId;
    }

    if (oldPassword !== "" && newPassword !== "") {
      const user = await contract.submitTransaction("readUsers", id);
      if (!user) {
        return { error: "No email found" };
      }
      const valid = await bcrypt.compare(oldPassword, JSON.parse(user).password);
      if (!valid) {
        return { error: "password invalid" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await contract.submitTransaction("updateUsers", id, name, hashedPassword, permission, updaterId);
      return { data: "Updated" };
    } else {

      await contract.submitTransaction("updateUsers", id, name, "", permission, updaterId);
      return ({ data: "Updated" });
    }
  } catch (e) {
    return { error: e.message };
  }
};

// delete user
exports.deleteUsers = async (req, res, contract) => {
  try {
    const { key, token } = req.body;
    await dataVerifications.verifyToken(contract, token, permissions[0]);
    await contract.submitTransaction("deleteUsers", key);
    return { data: "Deleted" };
  } catch (e) {
    return { error: e.message };
  }
};

exports.me = async (req, res, contract) => {
  try {
    const key = await dataVerifications.verifyToken(contract, req.body.token, );
    const response = await contract.submitTransaction("readUsers", key);
    const parsedData = JSON.parse(response);
    delete parsedData["password"];
    return parsedData;
  } catch (e) {
    return { error: e.message };
  }
};
// don't touch
exports.login = async (req, res, contract) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const data = await contract.submitTransaction("queryByObjectType", "Users");
    let user;
    JSON.parse(data).forEach((userData) => {
      if (userData.Record.email === email) {
        user = {
          ...user,
          ...userData,
        };
      }
    });
    if (!user) {
      return { error: "No email found" };
    }
    const valid = await bcrypt.compare(password, user.Record.password);
    if (!valid) {
      return { error: "email or password invalid" };
    }
    const token = jwt.sign(
      {
        userId: user.Key,
      },
      "MySecret"
    );
    return { token: token };
  } catch (e) {
    // res.status(500).json(JSON.stringify(e.message));
    return { error: e.message };
  }
};
