/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PolitiClearContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('PolitiClearContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new PolitiClearContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"politi clear 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"politi clear 1002 value"}'));
    });

    describe('#politiClearExists', () => {

        it('should return true for a politi clear', async () => {
            await contract.politiClearExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a politi clear that does not exist', async () => {
            await contract.politiClearExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createPolitiClear', () => {

        it('should create a politi clear', async () => {
            await contract.createPolitiClear(ctx, '1003', 'politi clear 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"politi clear 1003 value"}'));
        });

        it('should throw an error for a politi clear that already exists', async () => {
            await contract.createPolitiClear(ctx, '1001', 'myvalue').should.be.rejectedWith(/The politi clear 1001 already exists/);
        });

    });

    describe('#readPolitiClear', () => {

        it('should return a politi clear', async () => {
            await contract.readPolitiClear(ctx, '1001').should.eventually.deep.equal({ value: 'politi clear 1001 value' });
        });

        it('should throw an error for a politi clear that does not exist', async () => {
            await contract.readPolitiClear(ctx, '1003').should.be.rejectedWith(/The politi clear 1003 does not exist/);
        });

    });

    describe('#updatePolitiClear', () => {

        it('should update a politi clear', async () => {
            await contract.updatePolitiClear(ctx, '1001', 'politi clear 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"politi clear 1001 new value"}'));
        });

        it('should throw an error for a politi clear that does not exist', async () => {
            await contract.updatePolitiClear(ctx, '1003', 'politi clear 1003 new value').should.be.rejectedWith(/The politi clear 1003 does not exist/);
        });

    });

    describe('#deletePolitiClear', () => {

        it('should delete a politi clear', async () => {
            await contract.deletePolitiClear(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a politi clear that does not exist', async () => {
            await contract.deletePolitiClear(ctx, '1003').should.be.rejectedWith(/The politi clear 1003 does not exist/);
        });

    });

});
