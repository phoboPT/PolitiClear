'use strict';

class NodesTypes {

    constructor(name, createdAt, creatorId, isUsed) {
        this.name = name;
        this.createdAt = (createdAt === '' || createdAt === undefined) ? new Date() : createdAt;
        this.creatorId = creatorId;
        this.isUsed = (isUsed === '' || isUsed === undefined) ? 0 : isUsed;
        this.type = 'NodesTypes';
    }

    updateNodesTypes(isUsed) {
        if (isUsed !== '' && isUsed !== undefined) {
            this.isUsed = isUsed;
        }
    }
}

module.exports = NodesTypes;
