//用户分支中的material信息,ThreeJS的

//用户的分支信息
var Branch = function(name){

	this.name = name;
	this.ownMat = new Array();
}

Branch.prototype = {
	addMaterial:function(currentMat){
		this.ownMat.push(currentMat);
	},
	editBranch: function(newName){
		this.name = newName;
	},
	delMaterial: function(matidx){
		this.ownMat.splice(matidx,1);
	},
	editMaterial:function(matidx){//编辑branch下面第mat个material参数
		
	}
}


//用户存储分支信息的object
var BranchLib = function(){
	this.branchArray = new Array();
	this.changed = false;
	this.flag = false;//监视是否有新的mat
}
BranchLib.prototype = {
	addBranch:function(branch){
		this.branchArray.push(branch);
		},
	//该函数等待debug
	delBranch: function(branchidx){//删除了位于index branch的这个branch元素
		this.branchArray.splice(branchidx,1);
	}
}