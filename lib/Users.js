"use strict";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
];
class Users {
  constructor(name, email, password, createdAt) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = "Users";
    this.permission = ["USER"];
    this.createdAt = createdAt;
    this.updatedAt = "";
  }

  updateUsers(name, email, password) {
    if (name !== "") {
      this.name = name;
    }
    if (email !== "") {
      this.email = email;
    }
    if (password !== "") {
      this.password = password;
    }
    this.updatedAt = new Date();
  }
}

module.exports = Users;
