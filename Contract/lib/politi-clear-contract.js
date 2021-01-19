"use strict";

const { Contract } = require("fabric-contract-api");
const Arcs = require("./Arcs");
const Forms = require("./Forms");
const Nodes = require("./Nodes");
const NodesTypes = require("./NodesTypes");
const Users = require("./Users");
const Votes = require("./Votes");
const dataVerifications = require("./functions/dataVerifications");
class PolitiClearContract extends Contract {
  async dataExists(ctx, key, type) {
    const buffer = await ctx.stub.getState(key);
    return (!!buffer && buffer.length > 0 && JSON.parse(buffer.toString()).type === type);
  }

  //ARCS
  async createArcs(ctx, key, description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, creatorIdDescription, createdAt, totalVotes) {
    const asset = new Arcs(description, initialNode, initialNodeDescription, finalNode, finalNodeDescription, creatorId, creatorIdDescription, createdAt, totalVotes);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async readArcs(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      throw new Error(`The arc ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async getByKey(ctx, key) {

    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async updateArcs(ctx, key, description, totalVotes) {
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      throw new Error(`Error! The arc ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const arcUpdated = new Arcs(
      asset.description, asset.initialNode, asset.initialNodeDescription, asset.finalNode,
      asset.finalNodeDescription, asset.creatorId, asset.creatorIdDescription, asset.createdAt, asset.totalVotes);

    arcUpdated.updateArcs(description, totalVotes);
    const buffer = Buffer.from(JSON.stringify(arcUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteArcs(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      throw new Error(`The arc ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  //FORMS
  async createForms(ctx, key, email, message, createdAt, status, response, createdBy, creatorByDescription, upgradeRequest) {

    const asset = new Forms(email, message, createdAt, status, response, createdBy, creatorByDescription, upgradeRequest);


    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async readForms(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Forms"))) {
      throw new Error(`The formId ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async updateForms(ctx, key, status, response) {

    if (!(await this.dataExists(ctx, key, "Forms"))) {
      throw new Error(`Error! The forms Id ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());
    const formUpdated = new Forms(asset.email, asset.message, asset.createdAt, asset.status, asset.response, asset.createdBy, asset.creatorByDescription);
    formUpdated.updateForms(status, response);
    const buffer = Buffer.from(JSON.stringify(formUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteForms(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Forms"))) {
      throw new Error(`The form ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  // Nodes
  async readNodes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      throw new Error(`The Nodes ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createNodes(ctx, key, description, creatorId, creatorIdDescription, nodeType, nodeTypeDescription, createdAt) {
    const asset = new Nodes(description, creatorId, creatorIdDescription, nodeType, nodeTypeDescription, createdAt);

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateNodes(ctx, key, description, nodeType, nodeTypeDescription) {
    if (description === "" && nodeType === "") {
      throw new Error(`Error! Any data was filled to node ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      throw new Error(`The Node ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const nodesUpdated = new Nodes(asset.description, asset.creatorId, asset.creatorIdDescription, asset.nodeType, asset.nodeTypeDescription, asset.createdAt);
    nodesUpdated.updateNodes(description, nodeType, nodeTypeDescription);

    const buffer = Buffer.from(JSON.stringify(nodesUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteNodes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      throw new Error(`The node ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  // Nodes TYPES
  async readNodesTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      throw new Error(`The NodesType ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createNodesTypes(ctx, key, name, createdAt) {

    
    const query = await this.verifyNameAlreadyExists(ctx,name, "NodesTypes");
    
    if (query) {
      return{error:`Error! The NodesTypes ${name} already exists`}
    }
    // const data=await dataVerifications.verifyNameAlreadyExists(name, query);0

    const asset = new NodesTypes(name, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async deleteNodesTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      throw new Error(`The NodesTypes ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  // USERS
  async readUsers(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`The userkey ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createUsers(ctx, key, name, email, password, createdAt) {
    const newEmail = email.toLowerCase();
    const asset = new Users(name, newEmail, password, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
  }

  async updateUsers(ctx, key, name, password, permission) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`Error! The user ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const userUpdated = new Users(asset.name, asset.email, asset.password, asset.createdAt, asset.permission);
    userUpdated.updateUsers(name, password, permission);
    const buffer = Buffer.from(JSON.stringify(userUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteUsers(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`The user ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  // VOTES
  async readVotes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Votes"))) {
      throw new Error(`The vote ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createVotes(ctx, key, voter, voterDescription, arcId, vote, createdAt) {
    const asset = new Votes(voter, voterDescription, arcId, vote, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async deleteVotes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Votes"))) {
      throw new Error(`The vote ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  async searchNodesAux(ctx, query) {
    let resultsIterator = await ctx.stub.getQueryResult(query);
    let allNodes = [];
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        try {
          allNodes.push(res.value.key.toString("utf8"));
        } catch (err) {
          console.log("erro searchNodes ", err);
        }
      }
      if (res.done) {
        await resultsIterator.close();
        console.log("allnodes: " + allNodes.toString());
        return allNodes;
      }
    }
  };

  async searchNodes(ctx, query) {
    console.log("querySearch", query);
    return this.searchNodesAux(ctx, query);

  }

  async queryByObjectType(ctx, objectType) {
    const queryString = {
      selector: {
        type: objectType,
      },
    };

    console.log("query", queryString);
    const queryResults = await this.queryWithQueryString(
      ctx,
      JSON.stringify(queryString)
    );
    return queryResults;
  }

  /* ------------------------------------------------ */

  async queryWithQueryString(ctx, queryString) {

    const resultsIterator = await ctx.stub.getQueryResult(queryString);
    const allResults = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};


        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          jsonRes.Record = res.value.value.toString("utf8");
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        await resultsIterator.close();
        return JSON.stringify(allResults);
      }
    }
  }
  async verifyNameAlreadyExists(ctx, name, dataType) {
    const queryString = {
      selector: {
        type: dataType,
      },
    };

    const query = await this.queryWithQueryString(
      ctx,
      JSON.stringify(queryString)
    );

    const newData = JSON.parse(query);
    let data=false;
    for (let i = 0; i < newData.length; i++){      
      if (newData[i].Record.name === name) {
        data = true;
      }
    }   
 
    return data;
  }
}
module.exports = PolitiClearContract;