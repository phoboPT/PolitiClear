'use strict';

class Forms {

    constructor(email, message, createdAt, status, response, createdBy, creatorByDescription, upgradeRequest) {
        this.email = email;
        this.message = message;
        this.status = status;
        this.response = response;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.creatorByDescription = creatorByDescription;
        this.updatedAt = '';
        this.upgradeRequest = upgradeRequest;
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
