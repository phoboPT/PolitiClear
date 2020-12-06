'use strict';

const { Contract } = require('fabric-contract-api');
// const Forms = require('./Forms');
const Users = require('./Users');
const UsersTypes = require('./UsersTypes');
const { v4: uuidv4 } = require('uuid');
class PolitiClearContract extends Contract {

    async dataExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    // USERS
    async readUsers(ctx, id) {
        const exists = await this.dataExists(ctx, id);
        if (!exists) {
            throw new Error(`The userId ${id} does not exist`);
        }

        const buffer = await ctx.stub.getState(id);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async createUsers(ctx, name, email, password) {
        const id = uuidv4();
        // const exists = await this.dataExists(ctx, id);
        // if (exists) {
        //     throw new Error(`The userId ${id} already exists!`);
        // }
        const createdAt = new Date();
        const asset = new Users(name, email, password, createdAt);
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(id, buffer);
        return JSON.parse(buffer.toString());
    }

    async updateUsers(ctx, id, name, email, password) {
        const exists = await this.dataExists(ctx, id);
        if (!exists) {
            throw new Error(`The userId ${id} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(id);
        const asset = JSON.parse(buffer1.toString());

        const userUpdated = new Users(asset.name, asset.email, asset.password);
        userUpdated.updateUsers(name || '', email || '', password || '');

        const buffer = Buffer.from(JSON.stringify(userUpdated));
        await ctx.stub.putState(id, buffer);
    }

    // USERS TYPES
    async readUsersTypes(ctx, id) {
        const exists = await this.dataExists(ctx, id);
        if (!exists) {
            throw new Error(`The userType ${id} does not exist`);
        }

        const buffer = await ctx.stub.getState(id);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async createUsersTypes(ctx, name) {
        const id = uuidv4();
        const asset = new UsersTypes(name);

        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(id, buffer);
        return JSON.parse(buffer.toString());
    }

    async updateUsersTypes(ctx, id, name) {
        const exists = await this.dataExists(ctx, id);
        if (!exists) {
            throw new Error(`The userType ${id} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(id);
        const asset = JSON.parse(buffer1.toString());

        const userTypesUpdated = new UsersTypes(asset.name);
        userTypesUpdated.updateUsersTypes(name || '');

        const buffer = Buffer.from(JSON.stringify(userTypesUpdated));
        await ctx.stub.putState(id, buffer);
    }

    async deleteUsersTypes(ctx, key) {
        const exists = await this.dataExists(ctx, key);
        if (!exists) {
            throw new Error(`The userType ${key} does not exist`);
        }
        await ctx.stub.deleteState(key);
    }

    //USERSTYPES

    /* ------------------------------------------------ */

    async updatePolitiClear(ctx, politiClearId, newValue) {
        const exists = await this.dataExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The userId ${politiClearId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(politiClearId, buffer);
    }

    async deletePolitiClear(ctx, politiClearId) {
        const exists = await this.dataExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The politi clear ${politiClearId} does not exist`);
        }
        await ctx.stub.deleteState(politiClearId);
    }
    async queryWithQueryString(ctx, queryString) {

        console.log('query String');
        console.log(JSON.stringify(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }
    async queryByObjectType(ctx, objectType) {

        let queryString = {
            selector: {
                type: objectType
            }
        };

        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }

}

module.exports = PolitiClearContract;
