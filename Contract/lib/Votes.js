"use strict";

class Votes {
  constructor(payload) {
    const { voter, voterDescription, arcId, vote, createdAt } = payload;
    this.voter = voter;
    this.voterDescription = voterDescription;
    this.arcId = arcId;
    this.vote = parseInt(vote);
    this.createdAt = createdAt;
    this.updatedAt = "";
    this.type = "Votes";
  }
}

module.exports = Votes;
