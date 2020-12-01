

'use strict';
class Users {

    constructor(name, id, email, password) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.password = password;
        this.type = 'users';
    }
}
module.exports = Users;
