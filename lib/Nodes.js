'use strict';

class Nodes {

    constructor(description, creatorId, nodeTypeId, createdUserId, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.nodeTypeId = nodeTypeId;
        this.createdUserId = createdUserId;
        this.type = 'Nodes';
        this.createdAt = createdAt;
        this.updatedAt = '';
    }
    updateNodes(description, creatorId, nodeTypeId, createdUserId) {
        if (description !== '') {
            this.description = description;
        }
        if (creatorId !== '') {
            this.creatorId = creatorId;
        }
        if (nodeTypeId !== '') {
            this.nodeTypeId = nodeTypeId;
        }
        if (createdUserId !== '') {
            this.createdUserId = createdUserId;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Nodes;
