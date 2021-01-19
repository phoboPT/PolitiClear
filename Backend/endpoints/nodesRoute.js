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
		return { data: JSON.parse(response) }
	} catch (e) {
		return { error: e.message }
	}
};
const verify = async (contract, nodeType, creatorId) => {

	const a = dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
	const b = dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
	const res = Promise.all(
		[a, b]
	)
	return Promise.resolve(res);
}
// cria novo tipo
exports.createNodes = async function (req, res, contract) {
	try {
		let creatorId;
		if (req.body.token) {
			const userID = jwt.verify(req.body.token, "MySecret");
			creatorId = userID.userId;
		}
		const { description, nodeType } = req.body;
		await verify(contract, nodeType, creatorId);
		const key = uuidv4();
		const createdAt = new Date();

		let creatorIdDescription = await contract.submitTransaction('readUsers', creatorId);
		creatorIdDescription = JSON.parse(creatorIdDescription).name;
		let nodeTypeDescription = await contract.submitTransaction('readNodesTypes', nodeType);
		nodeTypeDescription = JSON.parse(nodeTypeDescription).name;

		await contract.submitTransaction('createNodes', key, description, creatorId, creatorIdDescription, nodeType, nodeTypeDescription, createdAt);
		return { data: "Created" }
	} catch (e) {
		return { error: e.message }
	}
};

// Update User
exports.updateNodes = async function (req, res, contract) {
	try {
		const { key, description, nodeType } = req.body;
		let nodeTypeDescription;
		if (nodeType !== "" && nodeType !== undefined) {
			await dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
			nodeTypeDescription = await contract.submitTransaction('readNodesTypes', nodeType);
			nodeTypeDescription = JSON.parse(nodeTypeDescription).name;
		}

		await contract.submitTransaction('updateNodes', key, description || "", nodeType || "", nodeTypeDescription || "");
		return { data: "Updated" }
	} catch (e) {
		return { error: e.message }
	}
};

// const deleteNodesAux = async (contract, key) => {
// 	const delNode = contract.submitTransaction('deleteNodes', key);
// 	const data = contract.submitTransaction("queryByObjectType", "Arcs");
// 	const res = await Promise.all(
// 		[delNode, data]
// 	);
// 	return Promise.resolve(res)
// }

// delete user
exports.deleteNodes = async function (req, res, contract) {
	try {
		const response = await contract.submitTransaction("queryByObjectType", "Arcs");
		//verifica se existem arcos com votos positivos
		for (let i = 0; i < JSON.parse(response).length; i++) {
			if (JSON.parse(response)[i].Record.finalNode === req.headers.key ||
				JSON.parse(response)[i].Record.initialNode === req.headers.key) {
				if (JSON.parse(response)[i].Record.totalVotes > 0) {
					return { error: 'Delete denied! Arcs already have votes' };
				}
			}

		};
		//remove nodo e arcos caso não haja votos em nenhum deles
		for (let i = 0; i < JSON.parse(response).length; i++) {
			if (JSON.parse(response)[i].Record.finalNode === req.headers.key ||
				JSON.parse(response)[i].Record.initialNode === req.headers.key) {
				await contract.submitTransaction('deleteArcs', JSON.parse(response)[i].Key);
			}
		};
		await contract.submitTransaction('deleteNodes', req.headers.key);

		return { data: "Deleted" }
	} catch (e) {
		return { error: e.message }
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
		const res = JSON.parse(res1)
		const key = []
		for (let i = 0; i < res.length; i++) {
			if (res[i].Record.description.toLowerCase().includes(description.toLowerCase())) {
				key.push(res[i])
			}
		}
		return key;
	} catch (e) {
		return { error: e.message };
	}
};
const search = async (contract, asset) => {
	const initial = contract.submitTransaction('getByKey', asset.initialNode);
	const final = contract.submitTransaction('getByKey', asset.finalNode);

	const res = await Promise.all(
		[initial, final]
	);
	return Promise.resolve(res)

}


exports.searchNodes = async function (req, res, contract) {
	try {
		const { key } = req.headers;
		const allData = await getNodes(key, contract);
		const result = [];

		for (let i = 0; i < allData.length; i++) {
			const buffer1 = await contract.submitTransaction('getByKey', allData[i]);
			const asset = JSON.parse(buffer1.toString());
			const data = {};
			data.arcId = allData[i];
			if (asset.initialNode === key) {
				const res = await search(contract, asset)
				data.initial = JSON.parse(res[0].toString());
				data.final = JSON.parse(res[1].toString());
				data.arc = asset;
			}
			else { //=== finalNode
				const res = await search(contract, asset)
				data.initial = JSON.parse(res[0].toString());
				data.final = JSON.parse(res[1].toString());
				data.arc = asset;
			}
			result.push(data);
		}
		return result;
	} catch (e) {
		return { error: e.message };
	}
};


exports.userNodes = async function (req, res, contract) {
	try {
		const { key } = req.headers;
		if (!key) {
			throw new Error("Your token is invalid");
		}
		const userID = jwt.verify(key, "MySecret");
		const creatorId = userID.userId;
		
		const buffer1 = await contract.submitTransaction('queryByObjectType', "Nodes" );
		const asset = JSON.parse(buffer1.toString());
		const result=asset.filter(item => {
			return item.Record.creatorId === creatorId;
		})
		
		return result;
	} catch (e) {
		return { error: e.message };
	}
};

exports.getRelations = async function (req, res, contract) {
	try {
		const { key } = req.headers;
		const arcos = await contract.submitTransaction('queryByObjectType', "Arcs");
		const nodes = await contract.submitTransaction('queryByObjectType', "Nodes");
		let neededNodes = []
		let nodesDetails = []

		// lista de nodos que tem ligações
		JSON.parse(arcos).forEach((arco) => {
			let aux = 0;

			neededNodes.forEach((item) => {
				if (arco.Record.initialNode === item) { aux = 1; }
			});

			if (aux === 0) { neededNodes.push(arco.Record.initialNode) }
			aux = 0;

			neededNodes.forEach((item) => {
				if (arco.Record.finalNode === item) { aux = 1; }
			});
			if (aux === 0) { neededNodes.push(arco.Record.finalNode) };
		});
		//adiciona os nodos em detalhe
		JSON.parse(nodes).forEach((nodo) => {
			neededNodes.forEach((item) => {
				if (nodo.Key === item) {
					nodesDetails.push(nodo);
				}
			})

		})

		let arcsByKey = []
		JSON.parse(arcos).forEach((arco) => {
			if(arco.Record.initialNode === key) {
				arcsByKey.push(arco.Key)
				
			}
		});
		arcsByKey.forEach((arc) => {
			
		})

		return { nodes: nodesDetails, arcs: JSON.parse(arcos) }
	} catch (e) {
		return { error: e.error };
	}
}