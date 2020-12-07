'use strict';

class Graphs {

    constructor(initialNode, finalNode, arcKey, createdAt) {
        this.initialNode = initialNode;
        this.finalNode = finalNode;
        this.arcKey = arcKey;
        this.type = 'Graphs';
        this.createdAt = createdAt;
        this.updatedAt = '';
    }

    updateGraphs(initialNode, finalNode, arcKey) {
        if (initialNode !== '') {
            this.initialNode = initialNode;
        }
        if (finalNode !== '') {
            this.finalNode = finalNode;
        }
        if (arcKey !== '') {
            this.arcKey = arcKey;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Graphs;
