"use strict";

class Users {
  constructor(payload) {
    const {
      name,
      email,
      password,
      permission,
      createdAt,
      credibility,
      activated,
    } = payload;

    this.name = name;
    this.email = email;
    this.password = password;
    this.type = "Users";
    this.permission = permission ? permission : "USER";
    this.createdAt = createdAt ? createdAt : new Date();
    this.updatedAt = "";
    this.updatedBy = "";
    this.credibility = credibility ? credibility : 0;
    this.activated = activated ? activated : 1;
  }

  updateUsers(payload) {
    const {
      name,
      password,
      permission,
      updatedBy,
      credibility,
      activated,
    } = payload;

    this.name = name ? name : this.name;
    this.password = password ? password : this.password;
    this.permission = permission ? permission : this.permission;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
    this.credibility = credibility
      ? parseInt(this.credibility || 0) + parseInt(credibility)
      : parseInt(this.credibility);

    this.activated = activated
      ? parseInt(activated)
      : parseInt(this.activated);
  }
}

module.exports = Users;
