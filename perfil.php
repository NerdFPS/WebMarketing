<?php
	session_start();
	include "Conexao.php";

	$login = $_SESSION['login_log'];
	$nome = $_SESSION['nome'];
	$CEP = $_SESSION['CEP'];
	$endereco = $_SESSION['endereco'];
	$celular = $_SESSION['celular'];
?>

<!DOCTYPE html>
<html>
<head>
	<title>Perfil</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="shortcut icon" href="logo.ico" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="perfilCss.css">
</head>
<body>
	<!-- MENU SUPERIOR -->
		<div class="topo">
			<div class="logo">
			<a href="index.php">
				<img src="imagens/logo.png">
			</a>
		</div>
		<div class="busca">
			<input type="text" name="busca" />
		</div>
		<div class="carrinho">
			<a href="carrinho.php"> <img src="carrinho.png"></a>
		</div>
		</div>
		
		<!-- FIM MENU SUPERIOR -->
		<!-- Perfil -->
		<div class="perfil">
			<img src="imagens/<?php print $login ?>.jpg">
			<form method="POST" action="operacoes.php">
			<div class="info">
				<div class="nome">
					<label for="nome">Nome:</label>
					<input type="text" name="nome" id="nome" <?php echo "value='$nome'" ?> />
				</div>

				<div class="cep">
					<label for="cep">Cep:</label>
					<input type="text" name="CEP" id="CEP" <?php echo "value='$CEP'" ?> />
				</div>

				<div class="ende">
					<label for="endereco">Endereço:</label>
					<input type="text" name="endereco" id="endereco" <?php echo "value='$endereco'" ?> />
				</div>

				<div class="cel">
					<label for="cel">Celular:</label>
					<input type="text" name="celular" id="celular" <?php echo "value='$celular'" ?> />
				</div>
				<button>
					<a href="logout.php">Sair</a>
				</button>
				<button type="submit" value="alterar" id="operacao" name="operacao">Alterar</button>
            	<button type="submit" value="excluir" id="operacao" name="operacao">Excluir</button>
			</div>
			</form>
		</div>
		<div class="rodape">
			<img src="imagens/logo.png">
				<div class="cartoes">
				<img src="cartoes.png">

				</div> 

				<div class="links">
				<a href="">Quem somos |</a>
				<a href="">Termos de Uso |</a>
				<a href="">Ambiente Seguro</a>
				</div>
		</div>
	</body>
</html>