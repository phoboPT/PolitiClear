const { v4: uuidv4 } = require('uuid');
// Pesquisa por key
exports.getByKey = async function (req, res, contract) {
	try {
		const response = await contract.submitTransaction(
			'readNodes',
			req.params.key,
		);

		res.status(200).send(JSON.parse(response));
	} catch (e) {
		res.status(500).json(e.message);
	}
};

// cria novo tipo
exports.createNodes = async function (req, res, contract) {
	try {
		const key = uuidv4();
		const createdAt = new Date();
		const { description, nodeType, creatorId, userCreated } = req.body;
		await contract.submitTransaction(
			'createNodes',
			key,
			description,
			nodeType,
			creatorId,
			userCreated,
			createdAt,
		);
		res.sendStatus(201);
	} catch (e) {
		res.status(500).json(e.message);
	}
};

// Update User
exports.updateNodes = async function (req, res, contract) {
	try {
		const { key, description, nodeType, creatorId, userCreated } = req.body;
		await contract.submitTransaction(
			'updateNodes',
			key,
			description,
			nodeType,
			creatorId,
			userCreated,
		);
		res.sendStatus(204);
	} catch (e) {
		res.status(500).json(e.message);
	}
};

exports.deleteNodes = async function (req, res, contract) {
	try {
		await contract.submitTransaction('deleteNodes', req.params.key);
		res.sendStatus(204);
	} catch (e) {
		res.status(500).json(e.message);
	}
};


exports.searchNodes = async function (req, res, contract) {
	try {
		const arc = {
			arcKey:"",
			initialNode: "",
			finalNode: ""
		}
		const { description } = req.headers;
		const allData = [];
		const queryNodes = {
			selector: {
				description: description,
				type: "Nodes",
			},
		};
		const res = await contract.submitTransaction('searchNodes', JSON.stringify(queryNodes));
		const allNodes = JSON.parse(res);
		// ciclo para ver todos initialNodes
		for (let i = 0; i < allNodes.length; i++) {
			allData.push(allNodes[i]);

			const queryArcsInitialNode = {
				selector: {
					initialNode: allNodes[i],
					type: "Arcs",
				},
			};
			const queryArcsFinalNode = {
				selector: {
					finalNode: allNodes[i],
					type: "Arcs",
				},
			};
			//procura todos os arcos com initialNode = id_nodo
			const initial = await contract.submitTransaction('searchNodes',
				JSON.stringify(queryArcsInitialNode));
			const allArcsInitial = JSON.parse(initial);
			allArcsInitial.forEach((arcsInitial) => {
				arc.arcKey = arcsInitial
			});

			//procura todos os arcos com finalNode = id_nodo
			const final = await contract.submitTransaction('searchNodes', JSON.stringify(queryArcsFinalNode));
			const allArcsFinal = JSON.parse(final);
			// percorre todos os arcos
			allArcsFinal.forEach((arcsFinal) => {
				arc.finalNode = arcsFinal;
				let exists = 0;
				//por cada arco, verifica se todos allData são diferentes
				allData.forEach((item) => {
					if (arcsFinal === item) {
						//existe igual
						exists = 1;
					}
				});

				//Se todos forem diferentes insere
				if (exists < 1) {
					arc.finalNode = arcsFinal;
					exists = 0;
				}
			});
		}
		arc.node = allData[0];
		const result={}
		if (arc.arcKey !== "") {
			
			const buffer1 = await contract.submitTransaction('getByKey', arc.arcKey);
			const asset = JSON.parse(buffer1.toString());
			arc.initialNode = asset.initialNode;
			arc.finalNode = asset.finalNode;

			const initial= await contract.submitTransaction('getByKey', arc.initialNode);
			result.initial=(JSON.parse(initial.toString()));

			const final = await contract.submitTransaction('getByKey', arc.finalNode);
			result.final=(JSON.parse(final.toString()));
			
			const conection = await contract.submitTransaction('getByKey', arc.arcKey);
			result.arc=( JSON.parse(conection.toString()));
		}
		

		return result;

	} catch (e) {
		res.status(500).json(e.message);
	}
};
