"use strict";

class Users {
  constructor(payload) {
    const { name, email, password, permission, createdAt, credibility } = payload;

    this.name = name;
    this.email = email;
    this.password = password;
    this.type = "Users";
    this.permission = permission ? permission : "USER";
    this.createdAt = createdAt ? createdAt : new Date();
    this.updatedAt = "";
    this.updatedBy = "";
    this.credibility = credibility ? credibility : 0;
  }

  updateUsers(payload) {
    const { name, password, permission, updatedBy, credibility } = payload;

    this.name = name ? name : this.name;
    this.password = password ? password : this.password;
    this.permission = permission ? permission : this.permission;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
    this.credibility = credibility ? credibility : this.credibility;
  }
}

module.exports = Users;
