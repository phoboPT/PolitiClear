'use strict';

class NodesTypes {

    constructor(name, createdAt) {
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'NodesTypes';
    }

    updateNodesTypes(name) {
        if (name !== '') {
            this.name = name;
        }
        this.updatedAt = new Date();
    }
}

module.exports = NodesTypes;
