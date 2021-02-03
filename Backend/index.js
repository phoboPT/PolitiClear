import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Gateway, Wallets } from "fabric-network";
import ConnectionProfile from "./ConnectionProfile.json";

const cors = require("cors");

// import de endpoints
const arcsRoute = require("./endpoints/arcsRoute");
const formsRoute = require("./endpoints/formsRoute");
const nodesRoute = require("./endpoints/nodesRoute");
const nodesTypesRoute = require("./endpoints/nodesTypesRoute");
const usersRoute = require("./endpoints/usersRoute");
const votesRoute = require("./endpoints/votesRoute");

const addData = require("./endpoints/functions/addData");

const connectToFabric = async () => {
  const walletPath = path.join(process.cwd(), "wallet/Org1");
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
    identity: "Org1 Admin",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("fabric");

  return contract;
};

let contract = null;
(async () => {
  contract = await connectToFabric();
})();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.listen(5000, () => {
  console.log("App is listening on port 5000, http://127.0.0.1:5000");
});

/* -----  ROUTES  ----- */
// Arcs
app.post("/arcs/create", async (req, res) => {
  const response = await arcsRoute.createArcs(req, res, contract);
  res.status(200).send(response);
});

app.get("/arcs/key/:key", async (req, res) => {
  const response = await arcsRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});

app.put("/arcs/update", async (req, res) => {
  const response = await arcsRoute.updateArcs(req, res, contract);
  res.status(200).send(response);
});

app.delete("/arcs/delete", async (req, res) => {
  const response = await arcsRoute.deleteArcs(req, res, contract);
  res.status(200).send(response);
});
app.get("/arcs/userArcs", async (req, res) => {
  const response = await arcsRoute.userArcs(req, res, contract);
  res.status(200).send(response);
});

// Forms
app.post("/forms/create", async (req, res) => {
  const response = await formsRoute.createForms(req, res, contract);
  res.status(200).send(response);
});

app.get("/forms/key/:key", async (req, res) => {
  const response = await formsRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});
app.get("/forms/open", async (req, res) => {
  const response = await formsRoute.getFormsOpen(req, res, contract);
  res.status(200).send(response);
});

app.put("/forms/update", async (req, res) => {
  const response = await formsRoute.updateForms(req, res, contract);
  res.status(200).send(response);
});

app.delete("/forms/delete", async (req, res) => {
  const response = await formsRoute.deleteForms(req, res, contract);
  res.status(200).send(response);
});

// nodes
app.get("/nodes/createRandom/:token", async (req, res) => {
  const response = await addData.addData(req, res, contract);
  res.status(200).send(response);
});

app.get("/nodes/key/:key", async (req, res) => {
  const response = await nodesRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});
app.post("/nodes/create", async (req, res) => {
  const response = await nodesRoute.createNodes(req, res, contract);
  res.status(200).send(response);
});

app.put("/nodes/update", async (req, res) => {
  const response = await nodesRoute.updateNodes(req, res, contract);
  res.status(200).send(response);
});

app.delete("/nodes/delete", async (req, res) => {
  const response = await nodesRoute.deleteNodes(req, res, contract);
  res.status(200).send(response);
});

app.get("/searchNodes", async (req, res) => {
  const response = await nodesRoute.searchNodes(req, res, contract);
  res.status(200).send(response);
});

app.get("/search", async (req, res) => {
  const response = await nodesRoute.search(req, res, contract);
  res.status(200).send(response);
});

app.get("/nodes/getRelations/", async (req, res) => {
  const response = await nodesRoute.getRelations(req, res, contract);
  res.status(200).send(response);
});

// nodesTypes
app.get("/nodesTypes/key/:key", async (req, res) => {
  const response = await nodesTypesRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});
app.post("/nodesTypes/create", async (req, res) => {
  const response = await nodesTypesRoute.createNodesTypes(req, res, contract);
  res.status(200).send(response);
});

app.delete("/nodesTypes/delete", async (req, res) => {
  const response = await nodesTypesRoute.deleteNodesTypes(req, res, contract);
  res.status(200).send(response);
});

// users
app.get("/users/key/:key", async (req, res) => {
  const response = await usersRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});
app.get("/users/name/:name", async (req, res) => {
  const response = await usersRoute.getByName(req, res, contract);
  res.status(200).send(response);
});
app.get("/users/acredited", async (req, res) => {
  const response = await usersRoute.getAcreditedUsers(req, res, contract);
  res.status(200).send(response);
});

app.post("/users/create", async (req, res) => {
  const response = await usersRoute.createUsers(req, res, contract);
  res.status(200).send(response);
});

app.put("/users/update", async (req, res) => {
  const response = await usersRoute.updateUsers(req, res, contract);
  res.status(200).send(response);
});

// Votes
app.get("/votes/key", async (req, res) => {
  const response = await votesRoute.getByKey(req, res, contract);
  res.status(200).send(response);
});

app.post("/votes/create", async (req, res) => {
  const response = await votesRoute.createVotes(req, res, contract);
  res.status(200).send(response);
});

app.delete("/votes/delete", async (req, res) => {
  const response = await votesRoute.deleteVotes(req, res, contract);
  res.status(200).send(response);
});

app.post("/me", async (req, res) => {
  const response = await usersRoute.me(req, res, contract);
  res.status(200).send(response);
});

app.post("/login", async (req, res) => {
  const response = await usersRoute.login(req, res, contract);
  res.status(200).send(response);
});

// rota para buscar por tipo e id
app.get("/readByType/:type", async (req, res) => {
  try {
    const data = await contract.submitTransaction(
      "queryByObjectType",
      req.params.type
    );
    const parsedData = JSON.parse(data);
    if (req.params.type === "Users") {
      parsedData.map((item) => {
        delete item.Record["password"];
        return item;
      });
    }

    res.status(200).send(parsedData);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// rota para buscar por tipo e id
app.get("/wait", async (req, res) => {
  try {
    const user = {
      name: "Antonio",
      email: "antonio@antonio.pt",
      mensagem: "Esta mensagem tem delay para demonstar o NestJS",
    };
    setTimeout(function () {
      res.status(200).send(user);
    }, 3000);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
