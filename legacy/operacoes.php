<?php
include 'verifica_login.php';
include 'conexao.php';

$operacao = $_POST["operacao"];
if($operacao == "excluir"){
    
    $login = $_SESSION['login_log'];
    $sql = "DELETE FROM clientes WHERE login = '$login'";
    
    if(mysqli_query($Conexao, $sql)){
        echo "<script>"
        . "alert('Usuario excluído com sucesso!');"
                . "window.location='logout.php';"
                . "</script>";
    }else{
        echo mysqli_error($Conexao);
    }
    
}

if($operacao == "alterar"){
    
    $login = $_SESSION['login_log'];
    $nome = mysqli_real_escape_string($Conexao, trim($_POST['nome']));
    $CEP = mysqli_real_escape_string($Conexao, trim($_POST['CEP']));
    $celular = mysqli_real_escape_string($Conexao, trim($_POST['celular']));
    $endereco = mysqli_real_escape_string($Conexao, trim($_POST['endereco']));
    
    $sql = "UPDATE clientes SET nome='$nome',CEP='$CEP',celular='$celular',endereco='$endereco' WHERE login = '$login'";
    if(mysqli_query($Conexao, $sql)){
        echo "<script>"
        . "alert('Usuario alterado com sucesso!');"
                . "window.location='perfil.php';"
                . "</script>";
    }else{
        echo mysqli_error($Conexao);
    }
    
}


?>