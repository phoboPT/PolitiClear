'use strict';

class Arcs {

    constructor(description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, creatorIdDescription, createdAt, totalVotes) {
        this.description = description;
        this.initialNode = initialNode;
        this.initialNodeDescription = initialNodeDescription;
        this.finalNode = finalNode;
        this.finalNodeDescription = finalNodeDescription;
        this.creatorId = creatorId;
        this.creatorIdDescription = creatorIdDescription;
        this.createdAt = createdAt;
        this.totalVotes = parseInt(totalVotes);
        this.updatedAt = '';
        this.type = 'Arcs';
    }

    updateArcs(description, totalVotes) {
        if (description !== '' && description !== undefined) {
            this.description = description;
        }
        if (totalVotes !== '' && totalVotes !== undefined) {
            this.totalVotes = totalVotes;
        }

        this.updatedAt = new Date();
    }
}

module.exports = Arcs;
