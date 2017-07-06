//用户分支中的material信息
var Mat = function(name){

	this.type = '';
	this.uuid = '';
	this.name = name;
	this.color = '';
	this.roughness = '';
	this.metalness = '';
	this.emissive = '';
	this.specular = '';
	this.shininess = '';
	this.clearcoat = '';
	this.skinning = '';
	this.map = '';
	this.alphamap = '';
	this.bumpmap = '';
	this.normalmap = '';
	this.displacemap = '';
	this.roughmap = '';
	this.metalmap = '';
	this.specularmap = '';
	this.envmap = '';
	this.lightmap = '';
	this.aomap = '';
	this.emissivemap = '';
	this.side = '';
	this.shading = '';
	this.blending = '';
	this.opacity = '';
	this.transparent = '';
	this.alphatest = '';
	this.wireframe = '';
}
Mat.prototype = {
	setType: function ( value ) {

		this.type = value;

	},
	editMaterial:function(branch,mat){//编辑branch下面第mat个material参数
		
	}

}

//用户的分支信息
var Branch = function(name){

	this.name = name;
	this.ownMat = new Array();
}

Branch.prototype = {

	addMaterial: function(mat){//mat是个object
		this.ownMat.push(mat);
	},
	editBranch: function(newName){
		this.name = newName;
	},
	delMaterial: function(mat){
		this.ownMat.splice(mat,1);
	}
}


//用户存储分支信息的object
var BranchLib = function(){
	this.branchArray = new Array();
}
BranchLib.prototype = {
	addBranch:function(branch){
		this.branchArray.push(branch);
		},
	//该函数等待debug
	delBranch: function(branch){//删除了位于index branch的这个branch元素
		this.branchArray.splice(branch,1);
	}
}