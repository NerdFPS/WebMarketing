<?PHP
session_start();
include('Conexao.php');

if(empty($_POST['login_log']) || empty($_POST['senha_log'])) {
  header('Location: cadastro.php#paralogin');
 exit();
}

$login = mysqli_real_escape_string($Conexao, $_POST['login_log']);
$senha = mysqli_real_escape_string($Conexao, $_POST['senha_log']);

$query = "SELECT * FROM `clientes` WHERE login = '$login' AND senha = '$senha'";

$result = mysqli_query($Conexao, $query);

$resultado = mysqli_fetch_array($result);
$_SESSION['login_log'] = $resultado['login'];
$_SESSION['nome'] = $resultado['nome'];
$_SESSION['CEP'] = $resultado['CEP'];
$_SESSION['endereco'] = $resultado['endereco'];
$_SESSION['celular'] = $resultado['celular'];

$row = mysqli_num_rows($result);

if($row == 1) {
   $_SESSION['login_log'] = $login;
   header('Location: perfil.php');
   exit();
} else {	
   $_SESSION['nao_autenticado'] = true;	
   header('Location: cadastro.php#paralogin');
   exit();
}