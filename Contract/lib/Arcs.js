"use strict";

class Arcs {
  constructor(payload) {
    const {
      description,
      initialNode,
      initialNodeDescription,
      initialNodeCreatorId,
      initialNodeCreatorIdDescription,
      initialNodeNodeType,
      initialNodeNodeTypeDescription,
      initialNodeCreatedAt,
      initialNodeUpdatedAt,
      finalNode,
      finalNodeDescription,
      finalNodeCreatorId,
      finalNodeCreatorIdDescription,
      finalNodeNodeType,
      finalNodeNodeTypeDescription,
      finalNodeCreatedAt,
      finalNodeUpdatedAt,
      creatorId,
      creatorIdDescription,
      totalVotes,
      isVoted,
      createdAt,
    } = payload;

    this.description = description;
    this.initialNode = initialNode;
    this.initialNodeDescription = initialNodeDescription;
    this.initialNodeCreatorId = initialNodeCreatorId;
    this.initialNodeCreatorIdDescription = initialNodeCreatorIdDescription;
    this.initialNodeNodeType = initialNodeNodeType;
    this.initialNodeNodeTypeDescription = initialNodeNodeTypeDescription;
    this.initialNodeCreatedAt = initialNodeCreatedAt;
    this.initialNodeUpdatedAt = initialNodeUpdatedAt;

    this.finalNode = finalNode;
    this.finalNodeDescription = finalNodeDescription;
    this.finalNodeCreatorId = finalNodeCreatorId;
    this.finalNodeCreatorIdDescription = finalNodeCreatorIdDescription;
    this.finalNodeNodeType = finalNodeNodeType;
    this.finalNodeNodeTypeDescription = finalNodeNodeTypeDescription;
    this.finalNodeCreatedAt = finalNodeCreatedAt;
    this.finalNodeUpdatedAt = finalNodeUpdatedAt;

    this.creatorId = creatorId;
    this.creatorIdDescription = creatorIdDescription;
    this.createdAt = createdAt ? createdAt : new Date();
    this.totalVotes = parseInt(totalVotes);
    this.isVoted = isVoted;
    this.updatedAt = "";
    this.updatedBy = "";
    this.type = "Arcs";
  }

  updateArcs(payload) {
    const {
      description,
      totalVotes,
      updatedBy,
      updatedByDescription,
      isVoted,
    } = payload;

    this.description = description ? description : this.description;

    this.totalVotes = totalVotes
      ? parseInt(totalVotes)
      : parseInt(this.totalVotes);
    this.updatedBy = updatedBy ? updatedBy : this.updatedBy;
    this.updatedByDescription = updatedByDescription
      ? updatedByDescription
      : this.updatedByDescription;
    this.isVoted = isVoted ? isVoted : this.isVoted;
    this.updatedAt = new Date();
  }
}

module.exports = Arcs;
