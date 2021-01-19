const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

exports.addData = async function (req, res, contract) {
  try {
    const createdAt = new Date();
    let creatorId;
    if (req.body.token) {
      const userID = jwt.verify(req.body.token, "MySecret");
      creatorId = userID.userId;
    }
    let creatorIdDescription = await contract.submitTransaction(
      "readUsers",
      creatorId
    );
    creatorIdDescription = JSON.parse(creatorIdDescription).name;

    const nodeType = [
      "Partido Político",
      "Representante Político",
      "Politico",
      "Função Politica",
      "Eventos",
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

    for (let i = 0; i < nodeType.length; i++) {
      const key = uuidv4();
      nodeTypeKey.push(key);
      await contract.submitTransaction(
        "createNodesTypes",
        key,
        nodeType[i],
        createdAt
      );
    }
    for (let i = 0; i < cargosPoliticos.length; i++) {
      const key = uuidv4();
      cargosPoliticosKey.push(key);
      await contract.submitTransaction(
        "createNodes",
        key,
        cargosPoliticos[i],
        creatorId,
        creatorIdDescription,
        nodeTypeKey[3],
        nodeType[3],
        createdAt
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
        nodeType[0],
        createdAt
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
        nodeType[4],
        createdAt
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
        nodeType[1],
        createdAt
      );
      await contract.submitTransaction(
        "createArcs",
        uuidv4(),
        "Representante",
        representantesPartidosKey[i],
        representantesPartidos[i],
        partidosKey[i],
        partidos[i],
        creatorId,
        creatorIdDescription,
        createdAt,
        0
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
        nodeType[2],
        createdAt
      );
      await contract.submitTransaction(
        "createArcs",
        uuidv4(),
        "Candidato",
        candidatosPresidenciaKey[i],
        candidatosPresidencia[i],
        cargosPoliticosKey[0],
        cargosPoliticos[0],
        creatorId,
        creatorIdDescription,
        createdAt,
        0
      );
    }

    //Presidenciais - Andre ventura
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Candidato",
      representantesPartidosKey[5],
      representantesPartidos[5],
      cargosPoliticosKey[0],
      cargosPoliticos[0],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    //presidente Marcelo
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Eleito 2016-2021",
      candidatosPresidenciaKey[0],
      candidatosPresidencia[0],
      cargosPoliticosKey[2],
      cargosPoliticos[2],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    //Primeiro Ministro
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Eleito 2015-2019",
      representantesPartidosKey[3],
      representantesPartidos[3],
      cargosPoliticosKey[1],
      cargosPoliticos[1],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    //polemica avante
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Realizou",
      partidosKey[0],
      partidos[0],
      eventosKey[0],
      eventos[0],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Critica",
      representantesPartidosKey[5],
      representantesPartidos[5],
      eventosKey[0],
      eventos[0],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    //Andre ventura
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Acusa",
      representantesPartidosKey[5],
      representantesPartidos[5],
      representantesPartidosKey[3],
      representantesPartidos[3],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );
    await contract.submitTransaction(
      "createArcs",
      uuidv4(),
      "Indica incompetência",
      representantesPartidosKey[5],
      representantesPartidos[5],
      candidatosPresidenciaKey[0],
      candidatosPresidencia[0],
      creatorId,
      creatorIdDescription,
      createdAt,
      0
    );

    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};
