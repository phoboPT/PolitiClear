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

    updateVotes(voter, arcId, nodeId, voteValue) {
        if (voter !== '') {
            this.voter = voter;
        }
        if (arcId !== '') {
            this.arcId = arcId;
        }
        if (nodeId !== '') {
            this.nodeId = nodeId;
        }
        if (voteValue !== '') {
            this.voteValue = voteValue;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Votes;
