const { CLIEngine } = require('eslint');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readVotes', req.headers.key);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// cria novo tipo
exports.createVotes = async function (req, res, contract) {
    try {
        let voter;
        if (req.body.token) {
            const userID = jwt.verify(req.body.token, "MySecret");
            voter = userID.userId;
        }
        const { arcId, vote } = req.body;

        if (voter === "" || vote === "" || arcId === "") {
            throw new Error(`Error! The data provided can not be inserted!`);
        };
        await dataVerifications.verifyKeyExists(voter, 'Users', contract);
        await dataVerifications.verifyKeyExists(arcId, 'Arcs', contract);

        const key = uuidv4();
        const createdAt = new Date();
        await contract.submitTransaction('createVotes', key, voter, arcId, vote, createdAt);

        //atualizar quantidade votos nos arcos
        const data = await contract.submitTransaction("queryByObjectType", "Votes");
        let totalVotes = 0;
        JSON.parse(data).forEach((votesData) => {
            if (votesData.Record.arcId === arcId) {
                totalVotes = totalVotes + Number(votesData.Record.vote);
            }
        });
        await contract.submitTransaction('updateArcs', arcId, "", "", "", "", totalVotes);
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

exports.deleteVotes = async function (req, res, contract) {
    try {
        //atualizar quantidade votos nos arcos
        const data = await contract.submitTransaction("queryByObjectType", "Votes");
        let arcId = '';
        let totalVotes = 0;
        JSON.parse(data).forEach((votesData) => {
            if (votesData.Key === req.headers.key) {
                arcId = votesData.Record.arcId;
            }
        });
        JSON.parse(data).forEach((votesData) => {
            if (votesData.Record.arcId === arcId && votesData.Key !== req.headers.key) {
                totalVotes = totalVotes + Number(votesData.Record.vote);
            }
        });
        
        await contract.submitTransaction('deleteVotes', req.headers.key);
        await contract.submitTransaction('updateArcs', arcId, "", "", "", "", totalVotes);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

