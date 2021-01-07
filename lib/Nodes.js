'use strict';

class Nodes {

    constructor(description, creatorId, nodeType, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.nodeType = nodeType;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Nodes';
    }

    updateNodes(description, creatorId, nodeType) {
        if (description !== '') {
            this.description = description;
        }
        if (creatorId !== '') {
            this.creatorId = creatorId;
        }
        if (nodeType !== '') {
            this.nodeType = nodeType;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Nodes;
