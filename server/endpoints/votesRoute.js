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

const verify = async (contract, userId, arcId) => {
    const a = dataVerifications.verifyKeyExists(userId, 'Users', contract);
    const b = dataVerifications.verifyKeyExists(arcId, 'Arcs', contract);
    await Promise.all([a, b]);
    return Promise.resolve();
}
// cria novo tipo
exports.createVotes = async function (req, res, contract) {
    try {
        if (vote === "") {
            throw new Error(`Error! The vote must be provided!`);
        };

        let voter, voterDescription;
        if (req.body.token) {
            voter = jwt.verify(req.body.token, "MySecret");
        }
        const { arcId, vote } = req.body;

        //verifica em simultaneo os parametros
        await verify(contract, voter.userId, arcId);

        voterDescription = await contract.submitTransaction('readUsers', voter.userId);
        voterDescription = JSON.parse(voterDescription).name

        const arc = await contract.submitTransaction('getByKey', arcId);
        const parsedData = JSON.parse(arc);
        const voteData = await contract.submitTransaction('queryByObjectType', "Votes");
        const parsedVote = JSON.parse(voteData);

        let alreadyVoted = false;
        for (let i = 0; i < parsedVote.length; i++) {
            if (parsedVote[i].Record.voter === voter.userId) {
                if (parsedVote[i].Record.arcId === arcId) {
                    alreadyVoted = true;
                    break;
                }
            }
        }
        if (alreadyVoted) {
            return ({ data: "Already voted" });
        }
        const key = uuidv4();
        const createdAt = new Date();
        const total = (parseInt(parsedData.totalVotes) || 0) + parseInt(vote);
        await contract.submitTransaction('createVotes', key, voter.userId, voterDescription, arcId, vote, createdAt);
        await contract.submitTransaction('updateArcs', arcId, "", "", "", "", "", "", parseInt(total));
        return ({ data: "Created" });
    } catch (e) {
        return ({ error: e.message });
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
        await contract.submitTransaction('updateArcs', arcId, "", "", "", "", "", "", totalVotes);
        return { data: "Deleted" };
    } catch (e) {
        return { error: e.message };
    }
};

