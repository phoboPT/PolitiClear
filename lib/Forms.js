'use strict';

class Forms {

    constructor(email, message, createdAt) {
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Forms';
    }

    updateForms(email, message) {
        if (email !== '') {
            this.email = email;
        }
        if (message !== '') {
            this.message = message;
        }
        this.updatedAt = new Date();
    }
}

module.exports = Forms;
