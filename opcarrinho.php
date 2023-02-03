<?php
session_start();
include("Conexao.php");

if(!empty($_POST['prod_id']) && is_numeric($_POST['prod_id'])) 
{
   $prod_id = $_POST['prod_id'];
}
else 
{
   echo "Ocorreu um erro ao enviar o produto para o carrinho.";
}

$prod_id = $_POST['prod_id'];

$sql = "SELECT * ";
$sql = $sql . " FROM produtos ";
$sql = $sql . " WHERE prod_id = $prod_id ";

$result = mysqli_query($Conexao, $sql);

$resultado = mysqli_fetch_array($result);
$_SESSION['nome_prod'] = $resultado['nome'];
$_SESSION['valor'] = $resultado['valor'];
$_SESSION['stt_produto'] = $resultado['stt_produto'];
$_SESSION['prod_id'] = $prod_id;

$row = mysqli_num_rows($result);

if($row == 1) {
   $_SESSION['prod_id'] = $prod_id;
   header('Location: carrinho.php');
   exit();
} else {	
   $_SESSION['nao_autenticado'] = true;	
   header('Location: index.php');
   exit();
}