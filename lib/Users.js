"use strict";


class Users {
  constructor(name, email, password, createdAt, permission = "") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = "Users";
    if (permission === "") {      
      this.permission = "USER";
    }
    else {
      this.permission = permission;
    }
    this.createdAt = createdAt;
    this.updatedAt = "";
  }

  updateUsers(name, password, permission ) {
    if (name !== "") {
      this.name = name;
    }  
    if (password !== "") {
      this.password = password;
    }
    if (permission !== "") {
      this.permission = permission;
    }
  

    this.updatedAt = new Date();
  }
}

module.exports = Users;
