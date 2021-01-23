"use strict";

class Forms {
  constructor(payload) {
    const {
      email,
      message,
      status,
      response,
      createdBy,
      creatorByDescription,
      upgradeRequest,
      createdAt,
    } = payload;

    this.email = email;
    this.message = message;
    this.status = status;
    this.response = response;
    this.createdBy = createdBy;
    this.creatorByDescription = creatorByDescription;
    this.updatedAt = "";
    this.upgradeRequest = upgradeRequest;
    this.createdAt = createdAt ? createdAt : new Date();
    this.type = "Forms";
  }

  updateForms(payload) {
    const { status, response } = payload;

    this.status = status ? status : this.status;

    this.response = response ? response : this.response;

    this.updatedAt = new Date();
  }
}

module.exports = Forms;
