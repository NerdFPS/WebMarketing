<?php
	session_start();
	if(!$_SESSION['login_log']) 
	{
		header('Location: index.php');
		exit();
	}
?>