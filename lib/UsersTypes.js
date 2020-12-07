'use strict';

class UsersTypes {

    constructor(name, createdAt) {
        this.name = name;
        this.type = 'UsersTypes';
        this.createdAt = createdAt;
        this.updatedAt = '';
    }

    updateUsersTypes(name) {
        if (name !== '') {
            this.name = name;
        }
        this.updatedAt = new Date();
    }
}

module.exports = UsersTypes;
