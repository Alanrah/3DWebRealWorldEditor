<?php
	if ($_FILES["file"]["error"] > 0)
	{
		echo "错误：" . $_FILES["file"]["error"] . "<br>";
	}
	else
	{
		echo "上传文件名: " . $_FILES["file"]["name"] . "<br>";
		echo "文件类型: " . $_FILES["file"]["type"] . "<br>";
		echo "文件大小: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
		echo "文件临时存储的位置: " . $_FILES["file"]["tmp_name"];
		echo "<br>";
	}

	echo "上传成功";

	$servername = "localhost";
	$username = "root";
	$password = "_1994313";
	$dbname = "3dmodels";
	 
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
	    die("连接失败: " . $conn->connect_error);
	} 
	else{
		echo "连接成功！";
	}


	$filename = 'examples/camera.app.json';

	$json_string = file_get_contents($_FILES["file"]["tmp_name"]); 

	var_dump($json_string);

	echo "<br>";

	$data = json_encode($json_string);
	var_dump($data);

	$sqlInsert = "INSERT INTO models (name, type, data, author , date, views, comments, likes) VALUES ('".$_FILES["file"]["name"]."', 'device', '".$json_string."' , 'noob', now(),  0, 0, 0);";//插入日期
	//$dat = date('Y-m-d');//插入date

	//$sqlInsert = "INSERT INTO models (name, type, data, author, date , views, comments, likes) VALUES ('arkanoid.app', 'device', 'wrong'  , 'noob', '".$dat."' , 0, 0, 0);";//插入日期

	//$sqlInsert = "INSERT INTO models (name, type, data, author, date , views, comments, likes) VALUES ('arkanoid.app', 'device', 'wrong'  , 'noob', now() , 0, 0, 0);";//插入具体时间

	//$format = "insert into models ( name, type, data,author, views,comments,likes) values ('arkanoid.app','device','%s','noob', 0,0,0)"

	//$sqlInsert = sprintf($fomat, $json_string)

	if ($conn->query($sqlInsert) === TRUE) {
	    echo "新记录插入成功";
	} else {
	    echo "Error: ". $sqlInsert . "<br>" . $conn->error;
	}

	$conn->close();
?>