'use strict';

class Nodes {
    
    constructor(id, description, creatorId, nodeTypeId, createdUserId, date) {
        this.id = id;
        this.description = description;
        this.creatorId = creatorId;
        this.nodeTypeId = nodeTypeId;
        this.createdUserId = createdUserId;
        this.date = date;
        this.type = 'Nodes';
    }
}

module.exports = Nodes;