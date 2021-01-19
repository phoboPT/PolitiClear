'use strict';

class Votes {

    constructor(voter, voterDescription, arcId, vote, createdAt) {
        this.voter = voter;
        this.voterDescription = voterDescription;
        this.arcId = arcId;
        this.vote = vote;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Votes';
    }
}

module.exports = Votes;
