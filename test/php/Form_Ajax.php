<?php	
	error_reporting(0);
	$Value=$_GET["Value"];
	$Type=$_GET["Type"];
	$con=mysql_connect("localhost","root","") or die('找不到要连接的服务器。');
	mysql_select_db("testajax",$con) or die('不能连接数据库。');
	mysql_set_charset('utf8');
	$res_radio=mysql_query("select * from phone") or die('取不来数据');
	$num = mysql_num_rows($res_radio);
	$row = mysql_fetch_array($res_radio);
	$flag=1;
	// sleep(3);
	for($j=0; $j < $num ; $j++){	
		if($Value==$row[$Type]){	
			$flag=0;
			break;
		}
		$row=mysql_fetch_array($res_radio);
	}
	echo $flag;
?>