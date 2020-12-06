'use strict';

class Users {

    constructor(name, email, password, createdAt) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = '';
        this.type = 'Users';
    }

    updateUsers(name, email, password) {
        if (name !== '') {
            this.name = name;
        }
        if (email !== '') {
            this.email = email;
        }
        if (password !== '') {
            this.password = password;
        }
        this.updatedAt = new Date();
    }

}

module.exports = Users;
