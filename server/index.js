import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Gateway, Wallets } from 'fabric-network';

import ConnectionProfile from '../ConnectionProfile.json';

// import de endpoints
const arcsRoute = require('./endpoints/arcsRoute');
const formsRoute = require('./endpoints/formsRoute');
const nodesRoute = require('./endpoints/nodesRoute');
const nodesTypesRoute = require('./endpoints/nodesTypesRoute');
const usersRoute = require('./endpoints/usersRoute');
const usersTypesRoute = require('./endpoints/usersTypesRoute');
const votesRoute = require('./endpoints/votesRoute');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
app.use(cors(
    {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
));

app.use(cookieParser());

// app.use((req, res, next) => {
//     const { token } = req.cookies;
//     console.log(req.cookie);

//     if (token) {
//         const { userId } = jwt.verify(token, 'MySecret');
//         // put the userId onto the req for future requests to access
//         req.userId = userId;
//     }
//     next();
// });

app.listen(5000, () => {
    console.log('App is listening on port 5000, http://127.0.0.1:5000');
});

/* -----  ROUTES  ----- */
// Arcs
app.post('/arcs/create', async (req, res) => {
    arcsRoute.createArcs(req, res, contract);
});

app.get('/arcs/key/:key', async (req, res) => {
    arcsRoute.getByKey(req, res, contract);
});

app.put('/arcs/update', async (req, res) => {
    arcsRoute.updateArcs(req, res, contract);
});

app.delete('/arcs/delete/:key', async (req, res) => {
    arcsRoute.deleteArcs(req, res, contract);
});

// Forms
app.post('/forms/create', async (req, res) => {
    formsRoute.createForms(req, res, contract);
});

app.get('/forms/key/:key', async (req, res) => {
    formsRoute.getByKey(req, res, contract);
});

app.put('/forms/update', async (req, res) => {
    formsRoute.updateForms(req, res, contract);
});

app.delete('/forms/delete/:key', async (req, res) => {
    formsRoute.deleteForms(req, res, contract);
});

// nodes
app.get('/nodes/key/:key', async (req, res) => {
    nodesRoute.getByKey(req, res, contract);
});
app.post('/nodes/create', async (req, res) => {
    nodesRoute.createNodes(req, res, contract);
});

app.put('/nodes/update', async (req, res) => {
    nodesRoute.updateNodes(req, res, contract);
});

app.delete('/nodes/delete/:key', async (req, res) => {
    nodesRoute.deleteNodes(req, res, contract);
});


// nodesTypes
app.get('/nodesTypes/key/:key', async (req, res) => {
    nodesTypesRoute.getByKey(req, res, contract);
});
app.post('/nodesTypes/create', async (req, res) => {
    nodesTypesRoute.createNodesTypes(req, res, contract);
});

app.put('/nodesTypes/update', async (req, res) => {
    nodesTypesRoute.updateNodesTypes(req, res, contract);
});

app.delete('/nodesTypes/delete/:key', async (req, res) => {
    nodesTypesRoute.deleteNodesTypes(req, res, contract);
});


// users
app.get('/users/key/:key', async (req, res) => {
    usersRoute.getByKey(req, res, contract);
});
app.get('/users/name/:name', async (req, res) => {
    usersRoute.getByName(req, res, contract);
});
app.post('/users/create', async (req, res) => {
    usersRoute.createUsers(req, res, contract);
});

app.put('/users/update', async (req, res) => {
    usersRoute.updateUsers(req, res, contract);
});

app.delete('/users/delete/:key', async (req, res) => {
    usersRoute.deleteUsers(req, res, contract);
});

// usertypes
app.get('/usersTypes/key/:key', async (req, res) => {
    usersTypesRoute.getByKey(req, res, contract);
});

app.post('/userTypes/create', async (req, res) => {
    usersTypesRoute.createUsersTypes(req, res, contract);
});

app.put('/usersTypes/update', async (req, res) => {
    usersTypesRoute.updateUsersTypes(req, res, contract);
});

app.delete('/usersTypes/delete/:key', async (req, res) => {
    usersTypesRoute.deleteUsersTypes(req, res, contract);
});

// Votes
app.get('/votes/key/:key', async (req, res) => {
    votesRoute.getByKey(req, res, contract);
});
app.post('/votes/create', async (req, res) => {
    votesRoute.createVotes(req, res, contract);
});

app.put('/votes/update', async (req, res) => {
    votesRoute.updateVotes(req, res, contract);
});

app.delete('/votes/delete/:key', async (req, res) => {
    votesRoute.deleteVotes(req, res, contract);
});

// LISTA de ROTAS
/*
    /:types
    /:types/:key
    /arcs
    /forms
        /:key
    /graphs
    /nodes
    /nodesTypes
    /users
        /:key
        /:name
    /usersTypes
        /:key
*/


app.post('/me', async (req, res) => {
    usersRoute.me(req, res, contract);
});

app.post('/login', async (req, res) => {
    usersRoute.login(req, res, contract);
});


// rota para buscar por tipo e id
app.get('/readByType/:type', async (req, res) => {
    try {
        const data = await contract.submitTransaction('queryByObjectType', req.params.type);

        res.status(200).send(JSON.parse(data));
    } catch (e) {
        res.status(500).json(e.message);
    }
});

