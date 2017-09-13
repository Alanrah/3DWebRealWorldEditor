<!DOCTYPE html>
<html>
<head>
	<title>3D models library</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<link rel="stylesheet" type="text/css" href="../css/model.css">
	<style>
		#load{
			display: none;
			width: 200px;
			height: 50px;
			background: #111111;
			color: #009DE9;
			top:100px;
			left: 330px;
			position: absolute;
		}
	</style>
</head>
<body>

	<div id="header" name='#top'>
		<h1>3D Model Library</h1>
		<a href="../index.html">3D Web Real World Editor  </a> &nbsp;&nbsp;/&nbsp;&nbsp;
		<a href="https://github.com/Alanrah/3DWebRealWorldEditor">  Github  </a>&nbsp;&nbsp;/&nbsp;&nbsp;
		 by 
		<a href="https://github.com/Alanrah">@Alanrah</a>

		<button id='upload'>Upload</button>
	</div>

	<div id="load">
		<form action="upload_file.php" method="post" enctype="multipart/form-data">
			<label for="file">文件名：</label>
			<input type="file" name="file" id="file">
			<input type="submit" name="submit" value="提交">
		</form>
	</div>

	<div id="viewer" color="#ccc" name="view">
		<h2>模型列表</h2>

		<?php
			$servername = "localhost";
			$username = "root";
			$password = "_1994313";
			$dbname = "3dmodels";
			 
			$conn = new mysqli($servername, $username, $password, $dbname);
			if ($conn->connect_error) {
			    die("连接失败: " . $conn->connect_error);
			} 
			 
			$sqlCheck = "SELECT * FROM models";
			$result = $conn->query($sqlCheck);
			 
			if ($result->num_rows > 0) { ?>
			<ul> <?php
			    while($row = $result->fetch_assoc()) { ?>
			    
			    <li>
				    <a href="#view"> 
				    <?php echo $row["name"]; ?>
				     </a>
			     </li>
			    <?php
			    }
			} else { ?>
			    <li><a href="#view"><?php echo "0 结果"; ?></a></li>
			     <?php } ?>

		</ul>
	</div>
	<div id="gallery"></div>

	

	<script>
	var upload = document.getElementById('upload');
	upload.onclick = function(){
		document.getElementById('load').style.display = "block";
	}
	var gallery = document.getElementById('gallery');
		for( var i = 0 ; i< 50; i++){
			gallery.innerHTML = gallery.innerHTML + "<a href=" + "#top" + "><img src=" + "../image/thumbnail.png" + "></a>"
		}
	</script>

</html>