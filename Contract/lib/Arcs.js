'use strict';

class Arcs {

    constructor(description, initialNode, initialNodeDescription, initialNodeCreatorId, initialNodeCreatorIdDescription,
        initialNodeNodeType, initialNodeNodeTypeDescription, initialNodeCreatedAt, initialNodeUpdatedAt,
        finalNode, finalNodeDescription, finalNodeCreatorId, finalNodeCreatorIdDescription,
        finalNodeNodeType, finalNodeNodeTypeDescription, finalNodeCreatedAt, finalNodeUpdatedAt,
        creatorId, creatorIdDescription, totalVotes, isVoted, createdAt) {
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
        this.createdAt = (createdAt === '' || createdAt === undefined) ? new Date() : createdAt;
        this.totalVotes = parseInt(totalVotes);
        this.isVoted = isVoted;
        this.updatedAt = '';
        this.updatedBy = '';
        this.type = 'Arcs';
    }

    updateArcs(description, totalVotes, updatedBy, updatedByDescription, isVoted) {
        if (description !== '' && description !== undefined) {
            this.description = description;
        }
        if (totalVotes !== '' && totalVotes !== undefined) {
            this.totalVotes = totalVotes;
        }
        updatedBy === undefined ? null : this.updatedBy = updatedBy;
        updatedByDescription === undefined ? null :this.updatedByDescription = updatedByDescription;
        (isVoted === undefined || isVoted === '') ? null : this.isVoted = isVoted;
        this.updatedAt = new Date();
    }
}

module.exports = Arcs;
