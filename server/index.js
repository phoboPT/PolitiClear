import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Gateway, Wallets } from "fabric-network";
import ConnectionProfile from "../ConnectionProfile.json";

const cookieParser = require("cookie-parser");
const cors = require("cors");

// import de endpoints
const arcsRoute = require("./endpoints/arcsRoute");
const formsRoute = require("./endpoints/formsRoute");
const nodesRoute = require("./endpoints/nodesRoute");
const nodesTypesRoute = require("./endpoints/nodesTypesRoute");
const usersRoute = require("./endpoints/usersRoute");
const votesRoute = require("./endpoints/votesRoute");


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
    origin: "http://localhost:7777",
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());

app.listen(5000, () => {
  console.log("App is listening on port 5000, http://127.0.0.1:5000");
});

/* -----  ROUTES  ----- */
// Arcs
app.post("/arcs/create", async (req, res) => {
  arcsRoute.createArcs(req, res, contract);
});

app.get("/arcs/key/:key", async (req, res) => {
  arcsRoute.getByKey(req, res, contract);
});

app.put("/arcs/update", async (req, res) => {
  arcsRoute.updateArcs(req, res, contract);
});

app.delete("/arcs/delete", async (req, res) => {
  arcsRoute.deleteArcs(req, res, contract);
});

// Forms
app.post("/forms/create", async (req, res) => {
  formsRoute.createForms(req, res, contract);
});

app.get("/forms/key/:key", async (req, res) => {
  formsRoute.getByKey(req, res, contract);
});

app.put("/forms/update", async (req, res) => {
  formsRoute.updateForms(req, res, contract);
});

app.delete("/forms/delete", async (req, res) => {
  formsRoute.deleteForms(req, res, contract);
});

// nodes
app.get("/nodes/key/:key", async (req, res) => {
  nodesRoute.getByKey(req, res, contract);
});
app.post("/nodes/create", async (req, res) => {
  nodesRoute.createNodes(req, res, contract);
});

app.put("/nodes/update", async (req, res) => {
  nodesRoute.updateNodes(req, res, contract);
});

app.delete("/nodes/delete", async (req, res) => {
  nodesRoute.deleteNodes(req, res, contract);
});

app.get("/searchNodes", async (req, res) => {
  const response = await nodesRoute.searchNodes(req, res, contract);
  res.status(200).send(response);
});

// nodesTypes
app.get("/nodesTypes/key/:key", async (req, res) => {
  nodesTypesRoute.getByKey(req, res, contract);
});
app.post("/nodesTypes/create", async (req, res) => {
  nodesTypesRoute.createNodesTypes(req, res, contract);
});

app.put("/nodesTypes/update", async (req, res) => {
  nodesTypesRoute.updateNodesTypes(req, res, contract);
});

app.delete("/nodesTypes/delete", async (req, res) => {
  nodesTypesRoute.deleteNodesTypes(req, res, contract);
});

// users
app.get("/users/key/:key", async (req, res) => {
  usersRoute.getByKey(req, res, contract);
});
app.get("/users/name/:name", async (req, res) => {
  const response = await usersRoute.getByName(req, res, contract);
  res.status(200).send(response);
});
app.post("/users/create", async (req, res) => {
  const response = await usersRoute.createUsers(req, res, contract);
  res.status(200).send(response);
});

app.put("/users/update", async (req, res) => {
  const response = await usersRoute.updateUsers(req, res, contract);
  console.log("response", response);
  res.status(200).send(response);
});

app.delete("/users/delete", async (req, res) => {
  usersRoute.deleteUsers(req, res, contract);
});

// Votes
app.get("/votes/key/:key", async (req, res) => {
  votesRoute.getByKey(req, res, contract);
});
app.post("/votes/create", async (req, res) => {
  votesRoute.createVotes(req, res, contract);
});

app.delete("/votes/delete", async (req, res) => {
  votesRoute.deleteVotes(req, res, contract);
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
        console.log(item);
        return item;
      });
    }

    res.status(200).send(parsedData);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
