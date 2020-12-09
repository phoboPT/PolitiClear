'use strict';

class Nodes {

    constructor(description, creatorId, nodeType, userCreated, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.nodeType = nodeType;
        this.userCreated = userCreated;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Nodes';
    }

    updateNodes(description, creatorId, nodeType, userCreated) {
        if (description !== '') {
            this.description = description;
        }
        if (creatorId !== '') {
            this.creatorId = creatorId;
        }
        if (nodeType !== '') {
            this.nodeType = nodeType;
        }
        if (userCreated !== '') {
            this.createdUserId = userCreated;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Nodes;
