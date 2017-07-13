//用户分支中的material信息
var Mat = function(name){

	this.name = name;
	//var material = new THREE.MeshStandardMaterial();
}
Mat.prototype = {
	setType: function ( value ) {

		this.type = value;

	}

}

//用户的分支信息
var Branch = function(name){

	this.name = name;
	this.ownMat = new Array();
}

Branch.prototype = {
	editBranch: function(newName){
		this.name = newName;
	},
	addMaterial: function(mat){//mat是个object
		this.ownMat.push(mat);
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