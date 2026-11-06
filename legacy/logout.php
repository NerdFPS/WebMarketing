<?php
session_start();
unset($_SESSION['login_log']);
header('Location: index.php');
exit();
?>