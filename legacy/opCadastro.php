<?php
session_start();
include("Conexao.php");

$login = mysqli_real_escape_string($Conexao, trim($_POST['login_cad']));
$nome = mysqli_real_escape_string($Conexao, trim($_POST['nome']));
$CEP = mysqli_real_escape_string($Conexao, trim($_POST['CEP']));
$celular = mysqli_real_escape_string($Conexao, trim($_POST['celular']));
$endereco = mysqli_real_escape_string($Conexao, trim($_POST['endereco']));
$senha = mysqli_real_escape_string($Conexao, trim($_POST['senha']));
$CPF = mysqli_real_escape_string($Conexao, trim($_POST['CPF']));
$num_cartao = mysqli_real_escape_string($Conexao, trim($_POST['num_cartao']));

$sql = "SELECT COUNT(*) AS total FROM cliente where CPF = '$CPF'";
$result = mysqli_query($Conexao, $sql);
$row = mysqli_fetch_assoc($result);

if($row['total'] == 1) {
   $_SESSION['CPF_existe'] = true;
   header('Location: cadastro.php');
   exit;
}

$sql = "INSERT INTO clientes (login, senha, nome, CPF, CEP, endereco, celular, num_cartao) VALUES ('$login', '$senha', '$nome', '$CPF', '$CEP', '$endereco', '$celular', '$num_cartao')";

if ($Conexao->query($sql) === TRUE) {
  $_SESSION['status_cadastro'] = true;
}

$Conexao->close();

header('Location: cadastro.php');
exit;
?>