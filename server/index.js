import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Gateway, Wallets } from 'fabric-network';

import ConnectionProfile from '../ConnectionProfile.json';
const usersRoute = require('./endpoints/usersRoute');

const connectToFabric = async () => {
    const walletPath = path.join(process.cwd(), 'wallet/Org1');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityLabels = await wallet.list();

    // eslint-disable-next-line no-restricted-syntax
    for (const label of identityLabels) {
        // eslint-disable-next-line no-await-in-loop
        const identity = await wallet.get(label);
        if (identity) {
            // eslint-disable-next-line no-await-in-loop
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

app.post('/create', async (req, res) => {
    try {
        const { id, value, otherValue } = req.body;
        await contract.submitTransaction('createPolitiClear', id, value, otherValue);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.get('/read/:id', async (req, res) => {
    usersRoute.getById(req, res, contract);
});

// rota para buscar por tipo e id
app.get('/readByType/:type/:id', async (req, res) => {
    try {
        const data = await contract.submitTransaction('queryByObjectType', req.params.type);
        // console.log(JSON.parse(data));
        const response = JSON.parse(data);
        let final;
        response.forEach(item => {
            if (parseInt(item.Key) === parseInt(req.params.id)) {
                final = item;
            }
        });
        res.status(200).send(final);
    } catch (e) {
        res.status(500).json(e.message);
    }
});
// Updates
app.put('/update', async (req, res) => {
    try {
        await contract.submitTransaction('updateBook', req.body.isbn, req.body.name);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

// Deletes

app.delete('/delete', async (req, res) => {
    try {
        await contract.submitTransaction('deleteBook', req.body.isbn);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
});
