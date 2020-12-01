'use strict';

class Users {
    
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = 'Users';
    }
}

module.exports = Users;
