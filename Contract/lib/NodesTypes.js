'use strict';

class NodesTypes {

    constructor(name, createdAt, creatorId) {
        this.name = name;
        this.createdAt = (createdAt === '' || createdAt === undefined) ? new Date() : createdAt;
        this.creatorId = this.creatorId
        this.type = 'NodesTypes';
    }
}

module.exports = NodesTypes;
