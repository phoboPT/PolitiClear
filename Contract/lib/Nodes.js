'use strict';

class Nodes {

    constructor(description, creatorId, creatorIdDescription, nodeType, nodeTypeDescription, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.creatorIdDescription = creatorIdDescription;
        this.nodeType = nodeType;
        this.nodeTypeDescription = nodeTypeDescription;
        this.createdAt = createdAt === '' ? new Date() : createdAt;
        this.updatedAt = '';
        this.updatedBy = ''
        this.type = 'Nodes';
    }

    updateNodes(description, nodeType, nodeTypeDescription, updatedBy, updatedByDescription) {
        if (description !== '' && description !== undefined) {
            this.description = description;
        }
        if (nodeType !== '' && nodeType !== undefined) {
            this.nodeType = nodeType;
            this.nodeTypeDescription = nodeTypeDescription;
        }
        this.updatedBy = updatedBy;
        this.updatedByDescription = updatedByDescription;
        this.updatedAt = new Date();
    }
}

module.exports = Nodes;
