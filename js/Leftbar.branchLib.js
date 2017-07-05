//用户存储分支信息的object
var branchLib = function(){
	this.branchArray = new Array();
}
branchLib.prototype = {

	addBranch: function(branch){
		this.branchArray.push(branch);
	}

	delBranch: function(branch){
		this.branchArray.splice(branch,1);
	}
}



var branch = function(){
	this.ownMat = new Array();
}

branch.prototype = {

	addMaterial: function(mat){//mat是个object
		this.ownMat.branchArray.push(mat);
	},


	delMaterial: function(mat){//mat是个索引
		this.ownMat.branchArray.splice(mat, 1);
	}
}



var ownMat = function(){

	this.type = '';
	this.uuid = '';
	this.name = '';
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
	this.light map = '';
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
ownMat.prototype = {
	setType: function ( value ) {

		this.type = value;

	},

}