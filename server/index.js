import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Gateway, Wallets } from 'fabric-network';

import ConnectionProfile from '../ConnectionProfile.json';

// import de endpoints
const usersRoute = require('./endpoints/usersRoute');
const usersTypesRoute = require('./endpoints/usersTypesRoute');
const cors = require('cors');

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
app.use(cors());

app.listen(5000, () => {
    console.log('App is listening on port 5000, http://127.0.0.1:5000');
});

// post's de users
app.post('/users/create', async (req, res) => {
    usersRoute.setUsers(req, res, contract);
});

app.post('/userTypes/create', async (req, res) => {
    usersTypesRoute.setUsersTypes(req, res, contract);
});

// update users
app.put('/users/update/', async (req, res) => {
    usersRoute.updateUsers(req, res, contract);
});

// LISTA de ROTAS
/*
    /:types
    /:types/:key
    /arcs
    /forms
    /graphs
    /nodes
    /nodesTypes
    /users
        /:key
        /:name
    /usersTypes
        /:key
*/

// users
app.get('/users/key/:key', async (req, res) => {
    usersRoute.getByKey(req, res, contract);
});
app.get('/users/name/:name', async (req, res) => {
    usersRoute.getByName(req, res, contract);
});

// usersTypes
app.get('/usersTypes/key/:key', async (req, res) => {
    usersTypesRoute.getByKey(req, res, contract);
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
// rota para buscar por tipo e id
app.get('/readByType/:type/', async (req, res) => {
    try {
        const data = await contract.submitTransaction('queryByObjectType', req.params.type);
        // console.log(JSON.parse(data));

        res.status(200).send(JSON.parse(data));
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
