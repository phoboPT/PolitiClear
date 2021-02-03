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
      key: "1a",
      name: "Administrator",
      email: "admin@politiclear.pt",
      password: await bcrypt.hash("admin", 10),
      permission: permissions[0],
    };
    await contract.submitTransaction("createUsers", JSON.stringify(user));

    user.key = "2a";
    user.name = "Acredited-User";
    user.email = "acredited@politiclear.pt";
    user.password = await bcrypt.hash("acredited", 10);
    user.permission = permissions[1];
    await contract.submitTransaction("createUsers", JSON.stringify(user));

    user.key = "3a";
    user.name = "Acredited-User 2";
    user.email = "acredited2@politiclear.pt";
    user.password = await bcrypt.hash("acredited2", 10);
    user.permission = permissions[1];
    await contract.submitTransaction("createUsers", JSON.stringify(user));
    user.key = "4a";
    user.name = "Acredited-User 3";
    user.email = "acredited3@politiclear.pt";
    user.password = await bcrypt.hash("acredited3", 10);
    user.permission = permissions[1];
    await contract.submitTransaction("createUsers", JSON.stringify(user));

    user.key = "5a";
    user.name = "User";
    user.email = "user@politiclear.pt";
    user.password = await bcrypt.hash("user", 10);
    delete user["permission"];
    await contract.submitTransaction("createUsers", JSON.stringify(user));
    user.key = "6a";
    user.name = "User 2";
    user.email = "user2@politiclear.pt";
    user.password = await bcrypt.hash("user2", 10);
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

    const creatorIdDescription2 = JSON.parse(
      await contract.submitTransaction("readUsers", "2a")
    ).name;
    const creatorIdDescription3 = JSON.parse(
      await contract.submitTransaction("readUsers", "3a")
    ).name;
    const creatorIdDescription4 = JSON.parse(
      await contract.submitTransaction("readUsers", "4a")
    ).name;

    const nodeTypes = [
      "Partido Político",
      "Cargo Político",
      "Politico",
      "Evento",
      "Jornalista",
      "Cidadão",
      "Empresa",
    ];
    const nodeTypeKey = [];

    const cargosPoliticos = ["Primeiro Ministro", "Presidente República"];
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

    const eventos = [
      "Presidência da República",
      "Festa Avante",
      "Operação Marquês",
      "Projeto TGV",
      "Parque Escolar",
      "Casas pré-fabricadas na Venezuela",
    ];
    let eventosKey = [];

    const politicos = [
      "Jerónimo de Sousa",
      "Francisco Rodrigues dos Santos",
      "Rui Rio",
      "António Costa",
      "Catarina Martins",
      "André Ventura",
      "Marcelo Rebelo de Sousa",
      "Ana Gomes",
      "João Ferreira",
      "Marisa Matias",
      "Tiago Mayan",
      "Vitorino Silva",
      "Pedro Passos Coelho",
      "José Socrates",
    ];
    let politicosKey = [];

    const cidadaos = [
      "Carlos Santos Silva",
      "Ricardo Salgado",
      "Joaquim Barroca",
      "Armando Vara",
      "Cidadão Holandes",
    ];
    let cidadaosKey = [];

    const empresas = [
      "BES - Banco Espirito Santo",
      "Grupo Lena",
      "Caixa Geral de Depósitos",
      "Vale do Lobo",
      "Ministério Público",
    ];
    let empresasKey = [];

    //create nodesTypes
    for (let i = 0; i < nodeTypes.length; i++) {
      const key = uuidv4();
      nodeTypeKey.push(key);
      const nodeType = { key, name: nodeTypes[i] };
      await contract.submitTransaction(
        "createNodesTypes",
        JSON.stringify(nodeType)
      );
      if (i < 5) {
        await contract.submitTransaction(
          "updateNodesTypes",
          JSON.stringify({ key, isUsed: 1 })
        );
      }
    }
    // create cargosPoliticos - NODES
    for (let i = 0; i < cargosPoliticos.length; i++) {
      const key = uuidv4();
      cargosPoliticosKey.push(key);
      const newNode = {
        key,
        description: cargosPoliticos[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[1],
        nodeTypeDescription: nodeTypes[1],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }
    // Partidos politicos - Nodes
    for (let i = 0; i < partidos.length; i++) {
      const key = uuidv4();
      partidosKey.push(key);
      const newNode = {
        key,
        description: partidos[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[0],
        nodeTypeDescription: nodeTypes[0],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }
    //Eventos - NODES
    for (let i = 0; i < eventos.length; i++) {
      const key = uuidv4();
      eventosKey.push(key);
      const newNode = {
        key,
        description: eventos[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[3],
        nodeTypeDescription: nodeTypes[3],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }

    //Politicos - NODES
    for (let i = 0; i < politicos.length; i++) {
      const key = uuidv4();
      politicosKey.push(key);
      const newNode = {
        key,
        description: politicos[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[2],
        nodeTypeDescription: nodeTypes[2],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }

    for (let i = 0; i < cidadaos.length; i++) {
      const key = uuidv4();
      cidadaosKey.push(key);
      const newNode = {
        key,
        description: cidadaos[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[5],
        nodeTypeDescription: nodeTypes[5],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }
    for (let i = 0; i < empresas.length; i++) {
      const key = uuidv4();
      empresasKey.push(key);
      const newNode = {
        key,
        description: empresas[i],
        creatorId,
        creatorIdDescription,
        nodeType: nodeTypeKey[6],
        nodeTypeDescription: nodeTypes[6],
      };
      await contract.submitTransaction("createNodes", JSON.stringify(newNode));
    }

    //..........................................................................

    for (let i = 0; i < partidos.length; i++) {
      await insertData(
        contract,
        "Representante",
        politicosKey[i],
        partidosKey[i],
        "2a"
      );
    }

    for (let i = 5; i < politicos.length && i < 12; i++) {
      await insertData(
        contract,
        "Candidato",
        politicosKey[i],
        eventosKey[0],
        "3a"
      );
    }

    //André Ventura
    await insertData(
      contract,
      "Realizou em 2020",
      partidosKey[0],
      eventosKey[1],
      "4a"
    ); //festa pcp - avante
    await insertData(
      contract,
      "Criticou",
      politicosKey[5],
      eventosKey[1],
      "4a"
    ); //ventura -avante
    await insertData(
      contract,
      "Acusa incompetência",
      politicosKey[5],
      politicosKey[3],
      "4a"
    ); //ventura -Costa
    //Marcelo Rebelo Sousa
    await insertData(
      contract,
      "Eleito 2016-2021",
      politicosKey[6],
      cargosPoliticosKey[1],
      "4a"
    );
    await insertData(
      contract,
      "Eleito 2021-2026",
      politicosKey[6],
      cargosPoliticosKey[1],
      "4a"
    );
    //Antonio Costa
    await insertData(
      contract,
      "Eleito 2015-2019",
      politicosKey[3],
      cargosPoliticosKey[0],
      "3a"
    );
    await insertData(
      contract,
      "Eleito 2019-2023",
      politicosKey[3],
      cargosPoliticosKey[0],
      "2a"
    );
    //Pedro Passos Coelho
    await insertData(
      contract,
      "Eleito 2011-2015",
      politicosKey[12],
      cargosPoliticosKey[0],
      "4a"
    );
    //José Socrates
    // await insertData(
    //   contract,
    //   "Eleito 2005-2011",
    //   politicosKey[13],
    //   cargosPoliticosKey[0],
    //   "2a"
    // );
    await insertData(
      contract,
      "Alvo do processo",
      politicosKey[13],
      eventosKey[2],
      "2a"
    );
    //Carlos Santos Silva
    await insertData(
      contract,
      "Guardou dinheiro em offshores",
      cidadaosKey[0],
      politicosKey[13],
      "3a"
    );
    //Ricardo Salgado
    await insertData(
      contract,
      "Pagou maioria das luvas",
      cidadaosKey[1],
      politicosKey[13],
      "3a"
    );
    await insertData(
      contract,
      "Antigo Presidente",
      cidadaosKey[1],
      empresasKey[0],
      "2a"
    );
    //Grupo Lena
    await insertData(
      contract,
      "Entregou 3 milhões ao testa-de-ferro de Socrates",
      empresasKey[1],
      cidadaosKey[0],
      "4a"
    );
    await insertData(
      contract,
      "Responsável pelo projeto",
      empresasKey[1],
      eventosKey[3],
      "4a"
    );
    await insertData(
      contract,
      "Fez obras",
      empresasKey[1],
      eventosKey[4],
      "4a"
    );
    await insertData(
      contract,
      "Construiu",
      empresasKey[1],
      eventosKey[5],
      "4a"
    );
    //
    await insertData(
      contract,
      "Comprou lote de terreno",
      cidadaosKey[4],
      empresasKey[3],
      "2a"
    );
    await insertData(
      contract,
      "Recebeu pagamento do lote",
      cidadaosKey[2],
      empresasKey[3],
      "3a"
    );
    await insertData(
      contract,
      "Receberam 1 milhão euros",
      cidadaosKey[3],
      cidadaosKey[2],
      "3a"
    );
    await insertData(
      contract,
      "Receberam 1 milhão euros",
      cidadaosKey[0],
      cidadaosKey[2],
      "2a"
    );
    await insertData(
      contract,
      "Favoreceu emprestimo avultado",
      empresasKey[2],
      empresasKey[3],
      "4a"
    );
    await insertData(
      contract,
      "Acusa José Socrates no caso",
      empresasKey[4],
      eventosKey[2],
      "2a"
    );

    return { data: "Created" };
  } catch (e) {
    return { error: e.message };
  }
};
