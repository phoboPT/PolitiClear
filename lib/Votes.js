'use strict';

class Votes {

    constructor(voter, arcId, vote, createdAt) {
        this.voter = voter;
        this.arcId = arcId;
        this.vote = vote;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Votes';
    }
}

module.exports = Votes;
