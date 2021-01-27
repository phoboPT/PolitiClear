"use strict";

class Nodes {
  constructor(payload) {
    const {
      description,
      creatorId,
      creatorIdDescription,
      nodeType,
      nodeTypeDescription,
      createdAt,
    } = payload;

    this.description = description;
    this.creatorId = creatorId;
    this.creatorIdDescription = creatorIdDescription;
    this.nodeType = nodeType;
    this.nodeTypeDescription = nodeTypeDescription;
    this.createdAt = createdAt ? createdAt : new Date();
    this.updatedAt = "";
    this.updatedBy = "";
    this.type = "Nodes";
  }

  updateNodes(payload) {
    const {
      description,
      nodeType,
      nodeTypeDescription,
      updatedBy,
      updatedByDescription,
    } = payload;

    this.description = description ? description : this.description;

    this.nodeType = nodeType ? nodeType : this.nodeType;
    this.nodeTypeDescription = nodeTypeDescription
      ? nodeTypeDescription
      : this.nodeTypeDescription;

    this.updatedBy = updatedBy;
    this.updatedByDescription = updatedByDescription;
    this.updatedAt = new Date();
  }
}

module.exports = Nodes;
