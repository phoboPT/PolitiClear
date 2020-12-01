'use strict';

const { Contract } = require('fabric-contract-api');
const Users = require('./Users');
const UsersTypes = require('./UsersTypes');

class PolitiClearContract extends Contract {

// USERS
    async usersExists(ctx, politiClearId) {
        const buffer = await ctx.stub.getState(politiClearId);
        return (!!buffer && buffer.length > 0);
    }

    async createUsers(ctx, politiClearId, name, email, password) {
        const exists = await this.usersExists(ctx, politiClearId);
        if (exists) {
            throw new Error(`The userId ${politiClearId} already exists!`);
        }
        const asset = new Users(name, email, password);
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(politiClearId, buffer);
        return JSON.parse(buffer.toString());
    }

    async readUsers(ctx, politiClearId) {
        const exists = await this.usersExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The userId ${politiClearId} does not exist`);
        }

        const buffer = await ctx.stub.getState(politiClearId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

//USERSTYPES


    async updatePolitiClear(ctx, politiClearId, newValue) {
        const exists = await this.usersExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The userId ${politiClearId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(politiClearId, buffer);
    }

    async deletePolitiClear(ctx, politiClearId) {
        const exists = await this.usersExists(ctx, politiClearId);
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
