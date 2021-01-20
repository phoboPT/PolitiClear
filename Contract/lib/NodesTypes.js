'use strict';

class NodesTypes {

    constructor(name, createdAt, creatorId) {
        this.name = name;
        this.createdAt = (createdAt === '' || createdAt === undefined) ? new Date() : createdAt;
        this.creatorId = creatorId
        this.type = 'NodesTypes';
    }
}

module.exports = NodesTypes;
