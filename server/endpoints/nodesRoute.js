const { v4: uuidv4 } = require('uuid');
const dataVerifications = require("./functions/dataVerifications");
const jwt = require("jsonwebtoken");

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
		let creatorId;
		if (req.body.token) {
			const userID = jwt.verify(req.body.token, "MySecret");
			creatorId = userID.userId;
		}
		const key = uuidv4();
		const createdAt = new Date();
		const { description, nodeType } = req.body;
		await dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
		await dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
		

		await contract.submitTransaction('createNodes', key, description, nodeType, creatorId, createdAt);
		res.sendStatus(201);
	} catch (e) {
		res.status(500).json(e.message);
	}
};

// Update User
exports.updateNodes = async function (req, res, contract) {
	try {
		const { key, description, nodeType, creatorId } = req.body;
		await dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
		await dataVerifications.verifyKeyExists(creatorId, 'Users', contract);

		await contract.submitTransaction('updateNodes', key, description || "", nodeType || "", creatorId || "");
		res.sendStatus(204);
	} catch (e) {
		res.status(500).json(e.message);
	}
};

exports.deleteNodes = async function (req, res, contract) {
	try {
		await contract.submitTransaction('deleteNodes', req.headers.key);
		res.sendStatus(204);
	} catch (e) {
		res.status(500).json(e.message);
	}
};


const getNodes = async (nodeId, contract) => {
	const allData = [];
	let arc = [];
		
		
	
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
		arc.push(arcsInitial)
	});
	
	// procura todos os arcos com finalNode = id_nodo
	const final = await contract.submitTransaction('searchNodes', JSON.stringify(queryArcsFinalNode));
	const allArcsFinal = JSON.parse(final);
	// percorre todos os arcos
	allArcsFinal.forEach((arcsFinal) => {
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
			arc.push(arcsFinal)
			exists = 0;
		}
	});
	
	
	return arc;

}
exports.search = async function (req, res, contract) {
    try {
		const { description } = req.headers;
	
		const res1 = await contract.submitTransaction('queryByObjectType', "Nodes");
		const res=JSON.parse(res1)
		const key = []
		for (let i = 0; i < res.length; i++){
			if (res[i].Record.description.includes(description)) {
				key.push(res[i])
			}
		}
	
        return key;

       
    } catch (e) {
        return[ e.message];
    }
};

exports.searchNodes = async function (req, res, contract) {
	try {
		const { key } = req.headers;
		// const key = "f7b139a1-11f1-4cd9-89f3-a4481c500b6e";

		const allData=await getNodes(key, contract);
		const result = [];

		
		for (let i = 0; i < allData.length; i++) {

			const buffer1 = await contract.submitTransaction('getByKey', allData[i]);
			const asset = JSON.parse(buffer1.toString());
			const data = {};
			data.arcId = allData[i];

			if (asset.initialNode === key) {
				const initial = await contract.submitTransaction('getByKey', asset.initialNode);
				data.initial = (JSON.parse(initial.toString()));
				const final = await contract.submitTransaction('getByKey', asset.finalNode);
				data.final = (JSON.parse(final.toString()));
				data.arc = asset;
			} 
			else { //=== finalNode
				const initial = await contract.submitTransaction('getByKey', asset.finalNode);
				data.initial = (JSON.parse(initial.toString()));
				const final = await contract.submitTransaction('getByKey', asset.initialNode);
				data.final = (JSON.parse(final.toString()));
				data.arc = asset;
			}

			
			// const initial = await contract.submitTransaction('getByKey', asset.initialNode);
			// data.initial = (JSON.parse(initial.toString()));
			// const final = await contract.submitTransaction('getByKey', asset.finalNode);
			// data.final = (JSON.parse(final.toString()));

			// data.arc = asset
			result.push(data);
		}
		return result;
	} catch (e) {
		res.status(500).json(e.message);
	}
};
