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
const verify = async (contract, nodeType,creatorId) => {

	const a= dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
	const b = dataVerifications.verifyKeyExists(creatorId, 'Users', contract);
	const res = Promise.all(
		
		[a,b]
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
		const key = uuidv4();
		const createdAt = new Date();
		const { description, nodeType } = req.body;
		
		await verify(contract,nodeType,creatorId);

		await contract.submitTransaction('createNodes', key, description, nodeType, creatorId, createdAt);
		return { data: "Created" }
	} catch (e) {
		return { error: e.message }
	}
};

// Update User
exports.updateNodes = async function (req, res, contract) {
	try {
		const { key, description, nodeType } = req.body;
		if (nodeType !== "" && nodeType !== undefined) {
			await dataVerifications.verifyKeyExists(nodeType, 'NodesTypes', contract);
		}
		await contract.submitTransaction('updateNodes', key, description || "", nodeType || "");
		return { data: "Updated" }
	} catch (e) {
		return { error: e.message }
	}
};

const deleteNodesAux = async (contract, key) => {
    const delNode = contract.submitTransaction('deleteNodes', key);
    const data = contract.submitTransaction("queryByObjectType", "Arcs");
    const res = await Promise.all(
        [delNode, data]
    );
    return Promise.resolve(res)
}

// delete user
exports.deleteNodes = async function (req, res, contract) {
    try {
        const res = await deleteNodesAux(contract, req.headers.key)
        JSON.parse(res[1]).forEach((arcsData) => {
            if (arcsData.Record.finalNode === req.headers.key || arcsData.Record.initialNode === req.headers.key) {
                contract.submitTransaction('deleteArcs', arcsData.Key);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        res.status(500).json(e.message);
    }
};

// exports.deleteNodes = async function (req, res, contract) {
// 	try {
// 		await contract.submitTransaction('deleteNodes', req.headers.key);
// 		return { data: "Deleted" }
// 	} catch (e) {
// 		return { error: e.message }
// 	}
// };


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
			if (res[i].Record.description.includes(description)) {
				key.push(res[i])
			}
		}
		return key;
	} catch (e) {
		return { error: e.message };
	}
};
const search = async (contract,asset) => {
	
	const initial =  contract.submitTransaction('getByKey', asset.initialNode);
	const final =  contract.submitTransaction('getByKey', asset.finalNode);

const res =await Promise.all(

	[ initial, final ]
		
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
				console.log(JSON.parse(res[0]));
				data.initial = JSON.parse(res[0].toString());
				data.final = JSON.parse(res[1].toString());
				data.arc = asset;
			}
			else { //=== finalNode
				const res = await search(contract, asset)
				console.log(JSON.parse(res[1]));
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
