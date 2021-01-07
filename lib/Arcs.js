'use strict';

class Arcs {

    constructor(description, initialNode, finalNode, creatorId, createdAt, totalVotes) {
        this.description = description;
        this.initialNode = initialNode;
        this.finalNode = finalNode;
        this.creatorId = creatorId;
        this.createdAt = createdAt;
        this.totalVotes = parseInt(totalVotes);
        this.updatedAt = '';
        this.type = 'Arcs';
    }

    updateArcs(description, initialNode, finalNode, creatorId, totalVotes) {
        if (initialNode !== '') {
            this.initialNode = initialNode;
        }
        if (finalNode !== '') {
            this.finalNode = finalNode;
        }
        if (description !== '') {
            this.description = description;
        }
        if (creatorId !== '') {
            this.creatorId = creatorId;
        }
        if (totalVotes !== '') {
            this.totalVotes = totalVotes;
        }

        this.updatedAt = new Date();
    }
}

module.exports = Arcs;
