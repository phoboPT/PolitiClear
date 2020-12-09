'use strict';

class Arcs {

    constructor(description, initialNode, finalNode, creatorId, createdAt) {
        this.description = description;
        this.initialNode = initialNode;
        this.finalNode = finalNode;
        this.creatorId = creatorId;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Arcs';
    }

    updateArcs(description, initialNode, finalNode, creatorId, date) {
        if (initialNode !== '') {
            this.initialNode = initialNode;
        }
        if (finalNode !== '') {
            this.finalNode = finalNode;
        }
        if (description !== '') {
            this.description = description;
        }
        if (creatorId !== '') {
            this.creatorId = creatorId;
        }
        if (date !== '') {
            this.date = date;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Arcs;
