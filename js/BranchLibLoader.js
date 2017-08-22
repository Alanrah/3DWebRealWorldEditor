var BranchLibLoader = function( materialDB ){

    var branchlib = new BranchLib();

    branchlib.changed = materialDB.changed;
    branchlib.flag = materialDB.flag;

    for( var i in materialDB.branchArray){
        var branch = new Branch(materialDB.branchArray[i].name)
        branchlib.branchArray.push(branch);
        for( var j in materialDB.branchArray[i].ownMat){
            
            var tempMat = new THREE[ materialDB.branchArray[i].ownMat[j].type ]();
            
            branchlib.branchArray[i].ownMat[j] = tempMat //不需保存任何变量
        }
    }
}