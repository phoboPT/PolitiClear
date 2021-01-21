'use strict';

class Forms {

    constructor(email, message, status, response, createdBy, creatorByDescription, upgradeRequest, createdAt) {
        this.email = email;
        this.message = message;
        this.status = status;
        this.response = response;
        this.createdBy = createdBy;
        this.creatorByDescription = creatorByDescription;
        this.updatedAt = '';
        this.upgradeRequest = upgradeRequest;
        this.createdAt = (createdAt === '' || createdAt === undefined) ? new Date() : createdAt;
        this.type = 'Forms';
    }

    updateForms(status, response) {
        if (status !== '' && status !== undefined) {
            this.status = status;
        }
        if (response !== '' && response !== undefined) {
            this.response = response;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Forms;
