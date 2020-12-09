'use strict';

class Votes {

    constructor(creatorId, arcId, nodeId, voteValue, createdAt) {
        this.creatorId = creatorId;
        this.arcId = arcId;
        this.nodeId = nodeId;
        this.voteValue = voteValue;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Votes';
    }

    updateVotes(creatorId, arcId, nodeId, voteValue) {
        if (creatorId !== '') {
            this.creatorId = creatorId;
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
