const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readVotes', req.headers.key);
        return { data: JSON.parse(response) };
    } catch (e) {
        return { error: e.message };
    }
};

// cria novo tipo
exports.createVotes = async function (req, res, contract) {
    try {
        const { token, arcId, vote } = req.body;
        if (vote === "") {
            throw new Error(`The vote must be provided!`);
        };

        const voter = await dataVerifications.verifyToken(contract, token,);
        const voterDescription = JSON.parse(await contract.submitTransaction('readUsers', voter)).name;

        await dataVerifications.verifyKeyExists(arcId, 'Arcs', contract);

        const parsedData = JSON.parse(await contract.submitTransaction('getByKey', arcId));
        const parsedVote = JSON.parse(await contract.submitTransaction('queryByObjectType', "Votes"));

        let alreadyVoted = false;
        for (let i = 0; i < parsedVote.length; i++) {
            if (parsedVote[i].Record.voter === voter) {
                if (parsedVote[i].Record.arcId === arcId) {
                    alreadyVoted = true;
                    break;
                }
            }
        }
        if (alreadyVoted) {
            return ({ error: "You already voted" });
        }
        const key = uuidv4();
        const createdAt = new Date();
        const total = (parseInt(parsedData.totalVotes) || 0) + parseInt(vote);
        await contract.submitTransaction('createVotes', key, voter, voterDescription, arcId, vote, createdAt);
        await contract.submitTransaction('updateArcs', arcId, "", parseInt(total), '', '', 1);
        return ({ data: "Created" });
    } catch (e) {
        return ({ error: e.message });
    }
};

exports.deleteVotes = async function (req, res, contract) {
    try {
        //atualizar quantidade votos nos arcos
        const data = await contract.submitTransaction("queryByObjectType", "Votes");
        let arcId = '', isVoted = 0;
        let totalVotes = 0;
        JSON.parse(data).forEach((votesData) => {
            if (votesData.Key === req.headers.key) {
                arcId = votesData.Record.arcId;
            }
        });
        JSON.parse(data).forEach((votesData) => {
            if (votesData.Record.arcId === arcId && votesData.Key !== req.headers.key) {
                totalVotes = totalVotes + Number(votesData.Record.vote);
                isVoted = 1;
            }
        });

        await contract.submitTransaction('deleteVotes', req.headers.key);
        await contract.submitTransaction('updateArcs', arcId, "", totalVotes, '', '', isVoted);
        return { data: "Deleted" };
    } catch (e) {
        return { error: e.message };
    }
};

