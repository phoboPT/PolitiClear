'use strict';

class NodesTypes {

    constructor(name, createdAt) {
        this.name = name;
        this.type = 'NodesTypes';
        this.createdAt = createdAt;
        this.updatedAt = '';
    }

    updateNodesTypes(name) {
        if (name !== '') {
            this.name = name;
        }
        this.updatedAt = new Date();
    }
}

module.exports = NodesTypes;
