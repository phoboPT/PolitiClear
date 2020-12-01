'use strict';

class Users {
    
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = 'Users';
    }
}

module.exports = Users;
