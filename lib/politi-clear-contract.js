/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Users {


    constructor(name, id, email, pasword) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.pasword = pasword;
    }
}

class PolitiClearContract extends Contract {

    async politiClearExists(ctx, politiClearId) {
        const buffer = await ctx.stub.getState(politiClearId);
        return (!!buffer && buffer.length > 0);
    }

    async createPolitiClear(ctx, politiClearId, value, otherValue) {
        const exists = await this.politiClearExists(ctx, politiClearId);
        if (exists) {
            throw new Error(`The politi clear ${politiClearId} already exists sdfsf`);
        }
        const asset = new Users(value, otherValue, '2342', '12421dfssdf' );
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(politiClearId, buffer);
        return JSON.parse(buffer.toString());
    }

    async readPolitiClear(ctx, politiClearId) {
        const exists = await this.politiClearExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The politi clear ${politiClearId} does not exist`);
        }

        const buffer = await ctx.stub.getState(politiClearId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updatePolitiClear(ctx, politiClearId, newValue) {
        const exists = await this.politiClearExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The politi clear ${politiClearId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(politiClearId, buffer);
    }

    async deletePolitiClear(ctx, politiClearId) {
        const exists = await this.politiClearExists(ctx, politiClearId);
        if (!exists) {
            throw new Error(`The politi clear ${politiClearId} does not exist`);
        }
        await ctx.stub.deleteState(politiClearId);
    }

}

module.exports = PolitiClearContract;
