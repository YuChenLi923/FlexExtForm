<?php

	error_reporting(0);
	header("Content-Type:text/html;charset=UTF-8");
	$companyName=$_POST["companyName"];
	$flag=1;
	$con=mysql_connect("localhost","root","") or die('找不到要连接的服务器。');
	mysql_select_db("testajax",$con) or die('不能连接数据库。');
	mysql_set_charset('utf8');
	$res_radio=mysql_query("select * from phone") or die('取不来数据');
	$num = mysql_num_rows($res_radio);
	$row = mysql_fetch_array($res_radio);
	for($j=0; $j < $num ; $j++){	
		if($companyName==$row["companyName"]){	
			$flag=0;
			break;
		}
		$row=mysql_fetch_array($res_radio);
	}
	if($flag==1){
		mysql_query("insert into phone value ('','$companyName')") ;
		echo 1;
	}
	else{
		echo 0;
	}
	
?>