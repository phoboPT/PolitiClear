// Pesquisa por id
exports.getById = async function (req, res, contract) {
    try {
        const response = await contract.submitTransaction('readPolitiClear', req.params.id);

        res.status(200).send(JSON.parse(response));
    } catch (e) {
        res.status(500).json(e.message);
    }
};
