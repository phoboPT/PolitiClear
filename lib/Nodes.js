'use strict';

class Nodes {

    constructor(description, creatorId, creatorIdDescription, nodeType, nodeTypeDescription, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.creatorIdDescription = creatorIdDescription;
        this.nodeType = nodeType;
        this.nodeTypeDescription = nodeTypeDescription;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Nodes';
    }

    updateNodes(description, nodeType, nodeTypeDescription) {
        if (description !== '' && description !== undefined) {
            this.description = description;
        }
        if (nodeType !== '' && nodeType !== undefined) {
            this.nodeType = nodeType;
            this.nodeTypeDescription = nodeTypeDescription;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Nodes;
