"use strict";

const { Contract } = require("fabric-contract-api");
const Arcs = require("./Arcs");
const Forms = require("./Forms");
const Nodes = require("./Nodes");
const NodesTypes = require("./NodesTypes");
const Users = require("./Users");
const UsersTypes = require("./UsersTypes");
const Votes = require("./Votes");

class PolitiClearContract extends Contract {
  async dataExists(ctx, key, type) {
    const buffer = await ctx.stub.getState(key);
    return (
      !!buffer &&
      buffer.length > 0 &&
      JSON.parse(buffer.toString()).type === type
    );
  }

  //FORMS
  async createArcs(
    ctx,
    key,
    description,
    initialNode,
    finalNode,
    creatorId,
    createdAt
  ) {
    const asset = new Arcs(
      description,
      initialNode,
      finalNode,
      creatorId,
      createdAt
    );
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

  async updateArcs(ctx, key, description, initialNode, finalNode, creatorId) {
    if (
      description === "" &&
      initialNode === "" &&
      finalNode === "" &&
      creatorId === ""
    ) {
      throw new Error(`Error! Any data was filled to update arc ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      throw new Error(`Error! The arc ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const arcUpdated = new Arcs(
      asset.description,
      asset.initialNode,
      asset.finalNode,
      asset.creatorId
    );
    arcUpdated.updateArcs(
      description || "",
      initialNode || "",
      finalNode || "",
      creatorId || ""
    );
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
  async createForms(ctx, key, email, message, createdAt) {
    const asset = new Forms(email, message, createdAt);
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

  async updateForms(ctx, key, email, message) {
    if (email === "" && message === "") {
      throw new Error(`Error! Any data was filled to update form ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "Forms"))) {
      throw new Error(`Error! The formsId ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const formUpdated = new Forms(asset.email, asset.message);
    formUpdated.updateForms(email || "", message || "");
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

  async createNodes(
    ctx,
    key,
    description,
    nodeType,
    creatorId,
    userCreated,
    createdAt
  ) {
    const asset = new Nodes(
      description,
      nodeType,
      creatorId,
      userCreated,
      createdAt
    );
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateNodes(ctx, key, description, nodeType, creatorId, userCreated) {
    if (
      description === "" &&
      nodeType === "" &&
      creatorId === "" &&
      userCreated === ""
    ) {
      throw new Error(`Error! Any data was filled to node ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      throw new Error(`The Node ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const nodesUpdated = new Nodes(
      asset.description,
      asset.nodeType,
      asset.creatorId,
      asset.userCreated
    );
    nodesUpdated.updateNodes(
      description || "",
      nodeType || "",
      creatorId || "",
      userCreated || ""
    );

    const buffer = Buffer.from(JSON.stringify(nodesUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteNodes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      throw new Error(`The Nodes ${key} does not exist`);
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
    const asset = new NodesTypes(name, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateNodesTypes(ctx, key, name) {
    if (name === "") {
      throw new Error(`Error! Any data was filled to node type ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      throw new Error(`The Node type ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const nodesTypesUpdated = new NodesTypes(asset.name);
    nodesTypesUpdated.updateNodesTypes(name || "");

    const buffer = Buffer.from(JSON.stringify(nodesTypesUpdated));
    await ctx.stub.putState(key, buffer);
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

  async updateUsers(ctx, key, name, email, password) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`Error! The user ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const userUpdated = new Users(asset.name, asset.email, asset.password);
    userUpdated.updateUsers(name || "", email || "", password || "");
    const buffer = Buffer.from(JSON.stringify(userUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteUsers(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`The userType ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  // USERS TYPES
  async readUsersTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "UsersTypes"))) {
      throw new Error(`The userType ${key} does not exist`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createUsersTypes(ctx, key, name, createdAt) {
    const asset = new UsersTypes(name, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateUsersTypes(ctx, key, name) {
    if (name === "") {
      throw new Error(`Error! Any data was filled to user type ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "UsersTypes"))) {
      throw new Error(`The userType ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const userTypesUpdated = new UsersTypes(asset.name);
    userTypesUpdated.updateUsersTypes(name || "");

    const buffer = Buffer.from(JSON.stringify(userTypesUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteUsersTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "UsersTypes"))) {
      throw new Error(`The userType ${key} does not exist`);
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

  async createVotes(ctx, key, creatorId, arcId, nodeId, createdAt) {
    const asset = new Votes(creatorId, arcId, nodeId, createdAt);
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateVotes(ctx, key, creatorId, arcId, nodeId) {
    if (creatorId === "" && arcId === "" && nodeId === "") {
      throw new Error(`Error! Any data was filled to vote ${key}`);
    }
    if (!(await this.dataExists(ctx, key, "Votes"))) {
      throw new Error(`The vote ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const votesUpdated = new Votes(asset.creatorId, asset.arcId, asset.nodeId);
    votesUpdated.updateVotes(creatorId || "", arcId || "", nodeId || "");

    const buffer = Buffer.from(JSON.stringify(votesUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteVotes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Votes"))) {
      throw new Error(`The vote ${key} does not exist`);
    }
    await ctx.stub.deleteState(key);
  }

  async searchNodesAux(ctx, query) {
    let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
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
  }

  async searchNodes(ctx, description) {
    const allData = [];
    const queryNodes = {
      selector: {
        description: description,
        type: "Nodes",
      },
    };
    const allNodes = await this.searchNodesAux(ctx, queryNodes);

    // ciclo para ver todos initialNodes
    for (let i = 0; i < allNodes.length; i++) {
      allData.push(allNodes[i]);

      const queryArcsInitialNode = {
        selector: {
          initialNode: allNodes[i],
          type: "Arcs",
        },
      };
      const queryArcsFinalNode = {
        selector: {
          finalNode: allNodes[i],
          type: "Arcs",
        },
      };

      //procura todos os arcos com initialNode = id_nodo
      const allArcsInitial = await this.searchNodesAux(
        ctx,
        queryArcsInitialNode
      );
      allArcsInitial.forEach((arcsInitial) => {
        allData.push(arcsInitial);
      });

      //procura todos os arcos com finalNode = id_nodo
      const allArcsFinal = await this.searchNodesAux(ctx, queryArcsFinalNode);
      //percorre todos os arcos
      allArcsFinal.forEach((arcsFinal) => {
        let exists = 0;
        //por cada arco, verifica se todos allData são diferentes
        allData.forEach((item) => {
          if (arcsFinal === item) {
            //existe igual
            exists = 1;
          }
        });

        //Se todos forem diferentes insere
        if (exists < 1) {
          allData.push(arcsFinal);
          exists = 0;
        }
      });
    }

    return ctx;
  }

  async queryByObjectType(ctx, objectType) {
    const queryString = {
      selector: {
        type: objectType,
      },
    };
    const queryResults = await this.queryWithQueryString(
      ctx,
      JSON.stringify(queryString)
    );
    return queryResults;
  }

  /* ------------------------------------------------ */

  async queryWithQueryString(ctx, queryString) {
    console.log(JSON.stringify(queryString));

    const resultsIterator = await ctx.stub.getQueryResult(queryString);
    const allResults = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        console.log(res.value.value.toString("utf8"));

        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString("utf8");
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log("end of data");
        await resultsIterator.close();
        console.info(allResults);
        console.log(JSON.stringify(allResults));
        return JSON.stringify(allResults);
      }
    }
  }
}

module.exports = PolitiClearContract;
