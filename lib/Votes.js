'use strict';

class Votes {

    constructor(voter, arcId, nodeId, voteValue, createdAt) {
        this.voter = voter;
        this.arcId = arcId;
        this.nodeId = nodeId;
        this.voteValue = voteValue;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Votes';
    }
}

module.exports = Votes;
