'use strict';

class Forms {

    constructor(email, message, createdAt, status, response, createdBy, upgradeRequest) {
        this.email = email;
        this.message = message;
        this.status = status;
        this.response = response;
        this.createdAt = createdAt;
        this.createdBy = createdBy
        this.updatedAt = '';
        this.upgradeRequest = upgradeRequest;
        this.type = 'Forms';
    }

    updateForms(email, message, status, response) {
        if (email !== '') {
            this.email = email;
        }
        if (message !== '') {
            this.message = message;
        }

        if (status !== '') {
            this.status = status;
        }
        if (response !== '') {
            this.response = response;
        }


        this.updatedAt = new Date();
    }
}

module.exports = Forms;
