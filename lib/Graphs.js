'use strict';

class Graphs {
    
    constructor(id, initialNode, finalNode, arcId) {
        this.id = id;
        this.initialNode = initialNode;
        this.finalNode = finalNode;
        this.arcId = arcId;
        this.type = 'Graphs';
    }
}

module.exports = Graphs;