'use strict';

class Users {

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = 'Users';
    }

    updateUsers(name, email, password) {
        if (name!=='') {
            this.name = name;
        }
        if (email !== '' ) {
            this.email=email;
        }
        if (password !== '' ) {
            this.password=password;
        }
    }

}

module.exports = Users;
