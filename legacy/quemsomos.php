<?php
	include "Conexao.php";
?>

<!DOCTYPE html>
<html>
<head>
	<title>Quem Somos</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="shortcut icon" href="logo.ico" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="quemsomoscss.css">
</head>
<body>
	<!-- MENU SUPERIOR -->
		<div class="topo">
			<div class="logo">
			<a href="index.php">
				<img src="imagens/logo.png">
			</a>
		</div>
		<div class="pesquisa">
			<input type="text" name="busca" />
			
		</div>
		<div class="busca">
			<button>Buscar</button>
		</div>
		<div class="login"> 

			<?php
				if (isset($_SESSION['login_log'])) { ?>
  					<a href="perfil.php"><img src="imagens/login-img.png"></a>
			<?php 
			} else { 
			?>
  				<a href="logar.php"><img src="imagens/login-img.png"></a>
			<?php
				}; 
			?>

			
		</div>

		<div class="carrinho">
			<a href="carrinho.php"> <img src="carrinho.png"></a>

		</div>
		</div>

		<div class="mini_menu">
	

			<div class="dropdown">
 				 <a href="index.php"><button class="dropbtn">Home</button></a>
			</div>
			<div class="dropdown">
  				<button class="dropbtn">Setores</button>
  			<div class="dropdown-content">
  				<a href="laticinios.php">Laticínios</a>
  				<a href="alimenticios.php">Alimentícios</a>
 				<a href="utensilios.php">Utensílios</a>
 				<a href="higiene.php">Higiene</a>
 			</div>
			</div>
			<div class="dropdown">
  				<a href="#"><button class="dropbtn">Sobre</button></a>

			</div>
		</div>
		
		<!-- FIM MENU SUPERIOR -->
		<!-- Quem Somos -->

			<div class="equipe">
				<h2>Nossa Equipe</h2>
				<p>Nossa equipe é composta pelos membros Tiago | Sandro | Vitor | Igor</p>
				<img src="imagens/equipe1.png">
				<div class="individual">
				<h2 style="font-weight: bolder">Funções</h2>
				<h3>Tiago de Assis Gonçalves Fernandes</h3>
				<img src="imagens/Tiago.jpg">
				<p>Responsável pelo o Design do Projeto</p>
				<h3>Sandro Henrique de Amorim Guedes</h3>
				<img src="imagens/Sandro.jpg">
				<p>Responsável pelo o Design</p>
				<h3>Vitor Elias Alves Amorim</h3>
				<img src="imagens/Vitor.jpg">
				<p>Responsável pela progamação em PHP, Banco de Dados e Documentação</p>	
				<h3>Igor Miguel Morais Campos</h3>
				<img src="imagens/Igor Miguel.jpg">
				<p>Responsável pelo Banco de Dados e Documentação</p>	

				</div>
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
		<!-- Fim do Quem Somos -->
	</body>
	</html>