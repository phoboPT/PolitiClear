const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const dataVerifications = require("./dataVerifications");
const { permissions } = require("./permissions");
const getNodesDescription = async (
  contract,
  initialNode,
  finalNode,
  creatorId
) => {
  const initial = contract.submitTransaction("readNodes", initialNode);
  const final = contract.submitTransaction("readNodes", finalNode);
  const creator = contract.submitTransaction("readUsers", creatorId);
  const res = await Promise.all([initial, final, creator]);
  return Promise.resolve(res);
};

const insertData = async (
  contract,
  descricao,
  initialNode,
  finalNode,
  creatorId
) => {
  const nodesData = await getNodesDescription(
    contract,
    initialNode,
    finalNode,
    creatorId
  );
  const initialNodeInfo = JSON.parse(nodesData[0]);
  const finalNodeInfo = JSON.parse(nodesData[1]);
  const creatorIdInfo = JSON.parse(nodesData[2]);

  const newArc = {
    key: uuidv4(),
    description: descricao,
    initialNode,
    initialNodeDescription: initialNodeInfo.description,
    initialNodeCreatorId: initialNodeInfo.creatorId,
    initialNodeCreatorIdDescription: initialNodeInfo.creatorIdDescription,
    initialNodeNodeType: initialNodeInfo.nodeType,
    initialNodeNodeTypeDescription: initialNodeInfo.nodeTypeDescription,
    initialNodeCreatedAt: initialNodeInfo.createdAt,
    initialNodeUpdatedAt: initialNodeInfo.updatedAt,
    finalNode,
    finalNodeDescription: finalNodeInfo.description,
    finalNodeCreatorId: finalNodeInfo.creatorId,
    finalNodeCreatorIdDescription: finalNodeInfo.creatorIdDescription,
    finalNodeNodeType: finalNodeInfo.nodeType,
    finalNodeNodeTypeDescription: finalNodeInfo.nodeTypeDescription,
    finalNodeCreatedAt: finalNodeInfo.createdAt,
    finalNodeUpdatedAt: finalNodeInfo.updatedAt,
    creatorId,
    creatorIdDescription: creatorIdInfo.name,
    totalVotes: 0,
  };
  await contract.submitTransaction("createArcs", JSON.stringify(newArc));
};
exports.addData = async function (req, res, contract) {
  try {
    const user = {
      key: "1",
      name: "Administrator",
      email: "admin@politiclear.pt",
      password: await bcrypt.hash("admin", 10),
      permission: permissions[0],
    };

    await contract.submitTransaction("createUsers", JSON.stringify(user));
    user.id = "2";
    user.name = "Acredited-User";
    user.email = "acredited@politiclear.pt";
    user.password = await bcrypt.hash("acredited", 10);
    user.permission = permissions[1];
    await contract.submitTransaction("createUsers", JSON.stringify(user));
    user.id = "3";
    user.name = "User";
    user.email = "user@politiclear.pt";
    user.password = await bcrypt.hash("user", 10);
    delete user["permission"];
    await contract.submitTransaction("createUsers", JSON.stringify(user));
    const creatorId = await dataVerifications.verifyToken(
      contract,
      req.params.token,
      permissions[0]
    );
    const creatorIdDescription = JSON.parse(
      await contract.submitTransaction("readUsers", creatorId)
    ).name;

    const nodeTypes = [
      "Partido Político",
      "Representante Político",
      "Politico",
      "Função Politica",
      "Eventos",
      "Jornalista",
    ];
    const nodeTypeKey = [];
    const cargosPoliticos = [
      "Presidência da República",
      "Primeiro Ministro",
      "Presidente República",
    ];
    let cargosPoliticosKey = [];
    const partidos = [
      "PCP - Partido Comunista Português",
      "CDS – Partido Popular",
      "PSD - Partido Social Democrata",
      "PS - Partido Socialista",
      "BE - Bloco de Esquerda",
      "CH - CHEGA",
    ];
    let partidosKey = [];
    const eventos = ["Festa Avante"];
    let eventosKey = [];
    const representantesPartidos = [
      "Jerónimo de Sousa",
      "Francisco Rodrigues dos Santos",
      "Rui Rio",
      "António Costa",
      "Catarina Martins",
      "André Ventura",
    ];
    let representantesPartidosKey = [];
    const candidatosPresidencia = [
      "Marcelo Rebelo de Sousa",
      "Ana Gomes",
      "João Ferreira",
      "Marisa Matias",
      "Tiago Mayan",
      "Vitorino Silva",
    ];
    let candidatosPresidenciaKey = [];

    for (let i = 0; i < nodeTypes.length; i++) {
      const key = uuidv4();
      nodeTypeKey.push(key);
      const nodeType = {
        key,
        name: nodeTypes[i],
      };
      await contract.submitTransaction(
        "createNodesTypes",
        JSON.stringify(nodeType)
      );
      if (i < 5) {
        await contract.submitTransaction(
          "updateNodesTypes",
          JSON.stringify({
            key,
            isUsed: 1,
          })
        );
      }
    }

    for (let i = 0; i < cargosPoliticos.length; i++) {
      const key = uuidv4();
      cargosPoliticosKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        partidos[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[0],
        nodeTypes[0]
      );
    }
    // Partidos politicos
    for (let i = 0; i < partidos.length; i++) {
      const key = uuidv4();
      partidosKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        partidos[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[0],
        nodeTypes[0]
      );
    }

    for (let i = 0; i < eventos.length; i++) {
      const key = uuidv4();
      eventosKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        eventos[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[4],
        nodeTypes[4]
      );
    }

    //Representantes Politicos
    for (let i = 0; i < representantesPartidos.length; i++) {
      const key = uuidv4();
      representantesPartidosKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        representantesPartidos[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[1],
        nodeTypes[1]
      );
      await insertData(
        contract,
        "Representante",
        representantesPartidosKey[i],
        partidosKey[i],
        creatorId
      );
    }
    //Candidatos presidenciais
    for (let i = 0; i < candidatosPresidencia.length; i++) {
      const key = uuidv4();
      candidatosPresidenciaKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        candidatosPresidencia[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[2],
        nodeTypes[2]
      );
      await insertData(
        contract,
        "Candidato",
        candidatosPresidenciaKey[i],
        cargosPoliticosKey[0],
        creatorId
      );
    }
    //Presidenciais - Andre ventura
    await insertData(
      contract,
      "Candidato",
      representantesPartidosKey[5],
      cargosPoliticosKey[0],
      creatorId
    );
    // //presidente Marcelo
    await insertData(
      contract,
      "Eleito 2016-2021",
      candidatosPresidenciaKey[0],
      cargosPoliticosKey[2],
      creatorId
    );
    // //Primeiro Ministro
    await insertData(
      contract,
      "Eleito 2015-2019",
      representantesPartidosKey[3],
      cargosPoliticosKey[1],
      creatorId
    );
    // //polemica avante
    await insertData(
      contract,
      "Realizou",
      partidosKey[0],
      eventosKey[0],
      creatorId
    );
    await insertData(
      contract,
      "Critica",
      representantesPartidosKey[5],
      eventosKey[0],
      creatorId
    );
    // //Andre ventura
    await insertData(
      contract,
      "Acusa",
      representantesPartidosKey[5],
      representantesPartidosKey[3],
      creatorId
    );
    await insertData(
      contract,
      "Indica incompetência",
      representantesPartidosKey[5],
      candidatosPresidenciaKey[0],
      creatorId
    );

    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};
