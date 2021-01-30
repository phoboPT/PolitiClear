"use strict";

class NodesTypes {
  constructor(payload) {
    const { name, createdAt, creatorId, isUsed } = payload;
    this.name = name;
    this.createdAt = createdAt ? createdAt : new Date();
    this.creatorId = creatorId;
    this.isUsed = isUsed ? parseInt(isUsed) : 0;
    this.type = "NodesTypes";
  }

  updateNodesTypes(isUsed) {
    this.isUsed = isUsed ? parseInt(isUsed) : parseInt(this.isUsed);
  }
}

module.exports = NodesTypes;
