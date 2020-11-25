import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Gateway,  Wallets } from 'fabric-network';

import ConnectionProfile from '../ConnectionProfile.json';

const connectToFabric = async () => {


    const walletPath = path.join(process.cwd(), 'wallet/Org1');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityLabels = await wallet.list();

    for (const label of identityLabels) {
        const identity = await wallet.get(label);
        if (identity) {
            await wallet.put(label, identity);
        }
    }

    const gateway = new Gateway();

    await gateway.connect(ConnectionProfile, {
        wallet,
        identity: 'Org1 Admin',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabric');

    return contract;
};

let contract = null;
(async () => {
    contract = await connectToFabric();
})();

const app = express();
app.use(bodyParser.json());

app.listen(5000, () => {
    console.log('App is listening on port 5000, http://127.0.0.1:5000');
});

app.post('/chaincode/create', async (req, res) => {
    try {
        const { id,value,otherValue } = req.body;
        await contract.submitTransaction('createPolitiClear', id, value,otherValue);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.get('/chaincode/read/:id', async (req, res) => {
    try {
        const response = await contract.submitTransaction('readPolitiClear', req.params.id);

        console.log(`response ${response}`);
        const edge = await contract.submitTransaction('readPolitiClear', JSON.parse(response).otherValue);

        console.log('node '+edge);
        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.put('/chaincode/update', async (req, res) => {
    try {
        await contract.submitTransaction('updateBook', req.body.isbn, req.body.name);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.delete('/chaincode/delete', async (req, res) => {
    try {
        await contract.submitTransaction('deleteBook', req.body.isbn);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
});
