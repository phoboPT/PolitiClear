"use strict";

const { Contract } = require("fabric-contract-api");
const Arcs = require("./Arcs");
const Forms = require("./Forms");
const Nodes = require("./Nodes");
const NodesTypes = require("./NodesTypes");
const Users = require("./Users");
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

  //ARCS
  async createArcs(ctx, payload) {
    const { key } = JSON.parse(payload);
    const asset = new Arcs(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return { data: "Created" };
  }

  async readArcs(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      return { error: `The arc ${key} does not exist` };
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

  async updateArcs(ctx, payload) {
    const { key } = JSON.parse(payload);
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      return { error: `The arc ${key} does not exist` };
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());
    const newArc = {
      description: asset.description,
      initialNode: asset.initialNode,
      initialNodeDescription: asset.initialNodeDescription,
      initialNodeCreatorId: asset.initialNodeCreatorId,
      initialNodeCreatorIdDescription: asset.initialNodeCreatorIdDescription,
      initialNodeNodeType: asset.initialNodeNodeType,
      initialNodeNodeTypeDescription: asset.initialNodeNodeTypeDescription,
      initialNodeCreatedAt: asset.initialNodeCreatedAt,
      initialNodeUpdatedAt: asset.initialNodeUpdatedAt,
      finalNode: asset.finalNode,
      finalNodeDescription: asset.finalNodeDescription,
      finalNodeCreatorId: asset.finalNodeCreatorId,
      finalNodeCreatorIdDescription: asset.finalNodeCreatorIdDescription,
      finalNodeNodeType: asset.finalNodeNodeType,
      finalNodeNodeTypeDescription: asset.finalNodeNodeTypeDescription,
      finalNodeCreatedAt: asset.finalNodeCreatedAt,
      finalNodeUpdatedAt: asset.finalNodeUpdatedAt,
      creatorId: asset.creatorId,
      creatorIdDescription: asset.creatorIdDescription,
      totalVotes: asset.totalVotes,
      isVoted: asset.isVoted,
      createdAt: asset.createdAt,
    };
    const arcUpdated = new Arcs(newArc);

    arcUpdated.updateArcs(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(arcUpdated));
    await ctx.stub.putState(key, buffer);
    return { data: "Updated" };
  }

  async deleteArcs(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Arcs"))) {
      return { error: `The arc ${key} does not exist` };
    }
    await ctx.stub.deleteState(key);
  }

  //FORMS
  async createForms(ctx, payload) {
    const { key } = JSON.parse(payload);

    const asset = new Forms(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return { data: "Success" };
  }

  async readForms(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Forms"))) {
      return { error: `The form ${key} does not exist` };
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async updateForms(ctx, payload) {
    const { key } = JSON.parse(payload);

    if (!(await this.dataExists(ctx, key, "Forms"))) {
      return { error: `The form ${key} does not exist` };
    }

    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());

    const oldForm = {
      email: asset.email,
      message: asset.message,
      status: asset.status,
      response: asset.response,
      createdBy: asset.createdBy,
      creatorByDescription: asset.creatorByDescription,
      createdAt: asset.createdAt,
    };

    const formUpdated = new Forms(oldForm);
    formUpdated.updateForms(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(formUpdated));
    await ctx.stub.putState(key, buffer);

    return { data: "Success" };
  }

  async deleteForms(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Forms"))) {
      return { error: `The form ${key} does not exist` };
    }
    await ctx.stub.deleteState(key);
  }

  // Nodes
  async readNodes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      return { error: `The node ${key} does not exist` };
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createNodes(ctx, payload) {
    const { key } = JSON.parse(payload);
    const asset = new Nodes(JSON.parse(payload));

    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return JSON.parse(buffer.toString());
  }

  async updateNodes(ctx, payload) {
    const { key, description, nodeType } = JSON.parse(payload);

    if (description === "" && nodeType === "") {
      return { error: `Error! Any data was filled to node ${key}` };
    }
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      return { error: `The node ${key} does not exist` };
    }
    console.log("newNode", JSON.parse(payload));
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());
    const oldNode = {
      description: asset.description,
      creatorId: asset.creatorId,
      creatorIdDescription: asset.creatorIdDescription,
      nodeType: asset.nodeType,
      nodeTypeDescription: asset.nodeTypeDescription,
      createdAt: asset.createdAt,
    };
    const nodesUpdated = new Nodes(oldNode);
    nodesUpdated.updateNodes(JSON.parse(payload));

    const buffer = Buffer.from(JSON.stringify(nodesUpdated));
    await ctx.stub.putState(key, buffer);
    return { data: "Successfully updated" };
  }

  async deleteNodes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Nodes"))) {
      return { error: `The node ${key} does not exist` };
    }
    await ctx.stub.deleteState(key);
  }

  // Nodes TYPES
  async readNodesTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      return { error: `The NodesType ${key} does not exist` };
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return { data: asset };
  }

  async createNodesTypes(ctx, payload) {
    const { name, key } = JSON.parse(payload);

    const query = await this.verifyNameAlreadyExists(ctx, name, "NodesTypes");
    if (query) {
      return { error: `Error! The NodesTypes ${name} already exists` };
    }

    const asset = new NodesTypes(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return { data: "Successfully added" };
  }
  async updateNodesTypes(ctx, payload) {
    const { key, isUsed } = JSON.parse(payload);

    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      throw new Error(`Error! The NodesTypes ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());
    const newNodeType = {
      name: asset.name,
      createdAt: asset.createdAt,
      creatorId: asset.creatorId,
      isUsed: asset.isUsed,
    };
    const nodesTypesUpdated = new NodesTypes(newNodeType);
    nodesTypesUpdated.updateNodesTypes(isUsed);
    const buffer = Buffer.from(JSON.stringify(nodesTypesUpdated));
    await ctx.stub.putState(key, buffer);
  }

  async deleteNodesTypes(ctx, key) {
    if (!(await this.dataExists(ctx, key, "NodesTypes"))) {
      return { error: `The Type ${key} does not exist.` };
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());

    if (asset.isUsed > 0) {
      return { error: `The Type ${key} is used, you can´t delete it.` };
    }

    await ctx.stub.deleteState(key);
    return { data: "Successfully deleted" };
  }

  // USERS
  async readUsers(ctx, key) {
    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`The userkey ${key} does not exist.`);
    }
    const buffer = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async createUsers(ctx, payload) {
    const { key } = JSON.parse(payload);
    const asset = new Users(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
  }

  async updateUsers(ctx, payload) {
    const { key } = JSON.parse(payload);

    if (!(await this.dataExists(ctx, key, "Users"))) {
      throw new Error(`Error! The user ${key} does not exist`);
    }
    const buffer1 = await ctx.stub.getState(key);
    const asset = JSON.parse(buffer1.toString());
    const newUser = {
      name: asset.name,
      email: asset.email,
      password: asset.password,
      permission: asset.permission,
      createdAt: asset.createdAt,
      credibility: asset.credibility,
      activated: asset.activated,
    };

    const userUpdated = new Users(newUser);
    userUpdated.updateUsers(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(userUpdated));
    await ctx.stub.putState(key, buffer);
    return { data: "Updated" };
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

  async createVotes(ctx, payload) {
    const { key } = JSON.parse(payload);
    const asset = new Votes(JSON.parse(payload));
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(key, buffer);
    return { data: "Sucess" };
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
        return allNodes;
      }
    }
  }

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
    let data = false;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].Record.name === name) {
        data = true;
      }
    }

    return data;
  }
}
module.exports = PolitiClearContract;
