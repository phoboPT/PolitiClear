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


const getNodes = async (nodeId, contract) => {
	const allData = [];
	const arc = {
		arcKey: "",
		initiaArc: "",
		finalArc: ""
	}
	const queryArcsInitialNode = {
		selector: {
			initialNode: nodeId,
			type: "Arcs",
		},
	};
	const queryArcsFinalNode = {
		selector: {
			finalNode: nodeId,
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

	// procura todos os arcos com finalNode = id_nodo
	const final = await contract.submitTransaction('searchNodes', JSON.stringify(queryArcsFinalNode));
	const allArcsFinal = JSON.parse(final);
	// percorre todos os arcos
	allArcsFinal.forEach((arcsFinal) => {
		arc.arcKey = arcsFinal;
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
			arc.arcKey = arcsFinal;
			exists = 0;
		}
	});

	return arc;

}

exports.searchNodes = async function (req, res, contract) {
	try {
		const arc = {
			arcKey: "",
			initialNode: "",
			finalNode: ""
		}
		const { description } = req.headers;
		const queryNodes = {
			selector: {
				description: description,
				type: "Nodes",
			},
		};
		const res = await contract.submitTransaction('searchNodes', JSON.stringify(queryNodes));
		const allNodes = JSON.parse(res);

		const allData = [];
		for (let i = 0; i < allNodes.length; i++) {

			const data = await getNodes(allNodes[i], contract);
			allData.push(data);
		}
		// ciclo para ver todos initialNodes
		const result = [];
		for await (const item of allData) {
			const data={}
			const buffer1 = await contract.submitTransaction('getByKey',item.arcKey);
			const asset = JSON.parse(buffer1.toString());
			console.log(asset);
			arc.initialNode = asset.initialNode;
			arc.finalNode = asset.finalNode;

			const initial = await contract.submitTransaction('getByKey', asset.initialNode);
			data.initial = (JSON.parse(initial.toString()));
			const final = await contract.submitTransaction('getByKey', asset.finalNode);
			data.final = (JSON.parse(final.toString()));
			
			const conection = await contract.submitTransaction('getByKey', item.arcKey);
			data.arc = (JSON.parse(conection.toString()));
			console.log("res",result);
			result.push(data)

		};

		return result;

	} catch (e) {
		res.status(500).json(e.message);
	}
};
