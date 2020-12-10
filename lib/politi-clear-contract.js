'use strict';

const { Contract } = require('fabric-contract-api');
const Forms = require('./Forms');
const Users = require('./Users');
const UsersTypes = require('./UsersTypes');
const Votes = require('./Votes');

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
    async createForms(ctx, key, email, message, createdAt) {
        const asset = new Forms(email, message, createdAt);
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(key, buffer);
        return JSON.parse(buffer.toString());
    }

    async readForms(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'Forms'))) {
            throw new Error(`The formId ${key} does not exist`);
        }
        const buffer = await ctx.stub.getState(key);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateForms(ctx, key, email, message) {
        if (email === '' && message === '') {
            throw new Error(`Error! Any data was filled to update form ${key}`);
        }
        if (!(await this.dataExists(ctx, key, 'Forms'))) {
            throw new Error(`Error! The formsId ${key} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(key);
        const asset = JSON.parse(buffer1.toString());

        const formUpdated = new Forms(asset.email, asset.message);
        formUpdated.updateForms(email || '', message || '');
        const buffer = Buffer.from(JSON.stringify(formUpdated));
        await ctx.stub.putState(key, buffer);
    }

    async deleteForms(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'Forms'))) {
            throw new Error(`The form ${key} does not exist`);
        }
        await ctx.stub.deleteState(key);
    }

    // USERS
    async readUsers(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'Users'))) {
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
        if (!(await this.dataExists(ctx, key, 'Users'))) {
            throw new Error(`Error! The user ${key} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(key);
        const asset = JSON.parse(buffer1.toString());

        const userUpdated = new Users(asset.name, asset.email, asset.password);
        userUpdated.updateUsers(name || '', email || '', password || '');
        const buffer = Buffer.from(JSON.stringify(userUpdated));
        await ctx.stub.putState(key, buffer);
    }

    async deleteUsers(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'Users'))) {
            throw new Error(`The userType ${key} does not exist`);
        }
        await ctx.stub.deleteState(key);
    }

    // USERS TYPES
    async readUsersTypes(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'UsersTypes'))) {
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
        if (name === '') {
            throw new Error(`Error! Any data was filled to user type ${key}`);
        }
        if (!(await this.dataExists(ctx, key, 'UsersTypes'))) {
            throw new Error(`The userType ${key} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(key);
        const asset = JSON.parse(buffer1.toString());

        const userTypesUpdated = new UsersTypes(asset.name);
        userTypesUpdated.updateUsersTypes(name || '');

        const buffer = Buffer.from(JSON.stringify(userTypesUpdated));
        await ctx.stub.putState(key, buffer);
    }

    async deleteUsersTypes(ctx, key) {
        if (!(await this.dataExists(ctx, key, 'UsersTypes'))) {
            throw new Error(`The userType ${key} does not exist`);
        }
        await ctx.stub.deleteState(key);
    }

    // VOTES
    async readVotes(ctx, key) {
        if (!await this.dataExists(ctx, key, 'Votes')) {
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
        if (creatorId === '' && arcId === '' && nodeId === '') {
            throw new Error(`Error! Any data was filled to vote ${key}`);
        }
        if (!await this.dataExists(ctx, key, 'Votes')) {
            throw new Error(`The vote ${key} does not exist`);
        }
        const buffer1 = await ctx.stub.getState(key);
        const asset = JSON.parse(buffer1.toString());

        const votesUpdated = new Votes(asset.creatorId, asset.arcId, asset.nodeId);
        votesUpdated.updateVotes(creatorId || '', arcId || '', nodeId || '');

        const buffer = Buffer.from(JSON.stringify(votesUpdated));
        await ctx.stub.putState(key, buffer);
    }

    async deleteVotes(ctx, key) {
        if (!await this.dataExists(ctx, key, 'Votes')) {
            throw new Error(`The vote ${key} does not exist`);
        }
        await ctx.stub.deleteState(key);
    }

    async queryByObjectType(ctx, objectType) {
        let queryString = {
            selector: {
                type: objectType,
            },
        };
        let queryResults = await this.queryWithQueryString(
            ctx,
            JSON.stringify(queryString)
        );
        return queryResults;
    }

    /* ------------------------------------------------ */

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
                    jsonRes.Record = JSON.parse(
                        res.value.value.toString('utf8')
                    );
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
}

module.exports = PolitiClearContract;
