'use strict';

class UsersTypes {

    constructor(name) {
        this.name = name;
        this.type = 'UsersTypes';
    }

    updateUsersTypes(name) {
        if (name !== '') {
            this.name = name;
        }
    }
}

module.exports = UsersTypes;
