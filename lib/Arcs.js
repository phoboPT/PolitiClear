'use strict';

class Arcs {

    constructor(description, creatorId, date, createdAt) {
        this.description = description;
        this.creatorId = creatorId;
        this.date = date;
        this.type = 'Arcs';
        this.createdAt = createdAt;
        this.updatedAt = '';
    }

    updateArcs(description, creatorId, date) {
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
