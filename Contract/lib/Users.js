"use strict";


class Users {
  constructor(name, email, password, permission, createdAt) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = "Users";
    this.permission = permission === '' ? "USER" : permission;
    this.createdAt = createdAt === '' ? new Date() : createdAt;
    this.updatedAt = "";
    this.updatedBy = "";
  }

  updateUsers(name, password, permission, updatedBy) {
    if (name !== "") {
      this.name = name;
    }
    if (password !== "") {
      this.password = password;
    }
    if (permission !== "") {
      this.permission = permission;
    }

    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }
}

module.exports = Users;
