
    // async searchNodesAux(ctx, query) {
    //     let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(query));
    //     let allNodes = [];
    //     while (true) {
    //         let res = await resultsIterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             try {
    //                 allNodes.push(res.value.key.toString('utf8'));
    //             } catch (err) {
    //                 console.log("erro searchNodes ", err);
    //             }
    //         }
    //         if (res.done) {
    //             await resultsIterator.close();
    //             console.log('allnodes: ' + allNodes.toString())
    //             return allNodes;
    //         }
    //     };
    // }

    // async searchNodes(ctx, description) {
    //     const allData = [];
    //     let queryNodes = {
    //         selector: {
    //             description: description,
    //             type: 'Nodes'
    //         },
    //     };
    //     let allNodes = await this.searchNodesAux(ctx, queryNodes);

    //     // ciclo para ver todos initialNodes
    //     for (let i = 0; i < allNodes.length; i++) {
    //         allData.push(allNodes[i]);

    //         let queryArcsInitialNode = {
    //             selector: {
    //                 initialNode: allNodes[i],
    //                 type: 'Arcs'
    //             },
    //         };
    //         let queryArcsFinalNode = {
    //             selector: {
    //                 finalNode: allNodes[i],
    //                 type: 'Arcs'
    //             },
    //         };

    //         let allArcsInitial = await this.searchNodesAux(ctx, queryArcsInitialNode);
    //         for (let j = 0; j < allArcsInitial.length; j++) {
    //             allData.push(allArcsInitial[j]);
    //         }

    //         let allArcsFinal = await this.searchNodesAux(ctx, queryArcsFinalNode);
    //         for (let j = 0; j < allArcsFinal.length; j++) {
    //             //verificar se já existe com inicial
    //             let exists=0;
    //             for (let k = 0; k < allData.length; k++) {
    //                 if (allArcsFinal[j] === allData[k]) {
    //                     //existe igual
    //                     exists=1;
    //                 }
    //             }
    //             if (exists < 1) {
    //                 allData.push(allArcsFinal[j]);
    //                 exists=0;
    //             }
    //         }
    //     }
    //     return JSON.stringify(allData);
    // }
