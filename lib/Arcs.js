'use strict';

class Arcs {

    constructor(description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, createdAt, totalVotes) {
        this.description = description;
        this.initialNode = initialNode;
        this.initialNodeDescription = initialNodeDescription;
        this.finalNode = finalNode;
        this.finalNodeDescription = finalNodeDescription;
        this.creatorId = creatorId;
        this.createdAt = createdAt;
        this.totalVotes = parseInt(totalVotes);
        this.updatedAt = '';
        this.type = 'Arcs';
    }

    updateArcs(description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, totalVotes) {
        if (initialNode !== '' && initialNode !== undefined) {
            this.initialNode = initialNode;
            this.initialNodeDescription = initialNodeDescription;
        }
        if (finalNode !== '' && finalNode !== undefined) {
            this.finalNode = finalNode;
            this.finalNodeDescription = finalNodeDescription;
        }
        if (description !== '' && description !== undefined) {
            this.description = description;
        }
        if (creatorId !== '' && creatorId !== undefined) {
            this.creatorId = creatorId;
        }
        if (totalVotes !== '' && totalVotes !== undefined) {
            this.totalVotes = totalVotes;
        }

        this.updatedAt = new Date();
    }
}

module.exports = Arcs;
