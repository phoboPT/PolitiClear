const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
  try {
    const response = await contract.submitTransaction(
      "readVotes",
      req.headers.key
    );
    return { data: JSON.parse(response) };
  } catch (e) {
    return { error: e.message };
  }
};

const getData = async (contract, arcId, voter) => {
  const arco = contract.submitTransaction("getByKey", arcId);
  const votes = contract.submitTransaction("queryByObjectType", "Votes");
  const user = contract.submitTransaction("readUsers", voter);

  const res = await Promise.all([arco, votes, user]);

  return Promise.resolve(res);
};

// cria novo tipo
exports.createVotes = async function (req, res, contract) {
  try {
    const { token, arcId, vote, arcUserId } = req.body;
    if (vote === "") {
      return { error: `You didnt provided a verification value` };
    }
    const voter = jwt.verify(token, "MySecret").userId;

    const data = await getData(contract, arcId, voter);

    const parsedData = JSON.parse(data[0]);
    const parsedVote = JSON.parse(data[1]);
    const voterDescription = JSON.parse(data[2]);

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
      return { error: "You already vote in this relation!" };
    }
    const key = uuidv4();
    const createdAt = new Date();
    const total = (parseInt(parsedData.totalVotes) || 0) + parseInt(vote);

    const voteData = {
      key,
      voter,
      voterDescription: voterDescription.name,
      arcId,
      vote: parseInt(vote),
      createdAt,
    };
    const response = await contract.submitTransaction(
      "createVotes",
      JSON.stringify(voteData)
    );
    const arcData = {
      key: arcId,
      totalVotes: parseInt(total),
      isVoted: 1,
    };
    await contract.submitTransaction("updateArcs", JSON.stringify(arcData));

    const newUser = {
      key: arcUserId,
      credibility: vote,
    };
    await contract.submitTransaction("updateUsers", JSON.stringify(newUser));

    return JSON.parse(response);
  } catch (e) {
    return { error: e.message };
  }
};

exports.deleteVotes = async function (req, res, contract) {
  try {
    //atualizar quantidade votos nos arcos
    const data = await contract.submitTransaction("queryByObjectType", "Votes");
    let arcId = "",
      isVoted = 0;
    let totalVotes = 0;
    JSON.parse(data).forEach((votesData) => {
      if (votesData.Key === req.headers.key) {
        arcId = votesData.Record.arcId;
      }
    });
    JSON.parse(data).forEach((votesData) => {
      if (
        votesData.Record.arcId === arcId &&
        votesData.Key !== req.headers.key
      ) {
        totalVotes = totalVotes + Number(votesData.Record.vote);
        isVoted = 1;
      }
    });

    await contract.submitTransaction("deleteVotes", req.headers.key);
    const newArc = {
      key: arcId,
      totalVotes,
      isVoted,
    };
    await contract.submitTransaction("updateArcs", JSON.stringify(newArc));
    return { data: "Deleted" };
  } catch (e) {
    return { error: e.message };
  }
};
