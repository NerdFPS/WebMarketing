<?PHP
include "Conexao.php";
SESSION_START();

if (isset($_GET["ordenar"])) {
$ordenar = $_GET['ordenar'];
} else {
$ordenar = "";
}
if ($ordenar == "") {
$ordenar = "valor DESC";
} else {
$ordenar = $_GET['ordenar'];
}

$sql = "SELECT * ";
$sql = $sql . " FROM produtos ";
$sql = $sql . " WHERE stt_produto = 'Disponível' ";
$sql = $sql . " ORDER BY " . $ordenar;

$rs = mysqli_query($Conexao, $sql);
$total_registros = mysqli_num_rows($rs);
?>

<!DOCTYPE html>
<html>
<head>
	<title>Página Inicial</title>
	<meta charset="utf-8">
	<link rel="shortcut icon" href="logo.ico" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="estilo.css">
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
			<a href="carrinho.php"><img src="carrinho.png"></a>
		</div>
		</div>

		<div class="mini_menu">
	

			<div class="dropdown">
 				 <a href="#"><button class="dropbtn">Home</button></a>
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
  				<a href="quemsomos.php"><button class="dropbtn">Sobre</button></a>

			</div>
		</div>
		
		<!-- FIM MENU SUPERIOR -->


		<!-- BANNER -->
<br>
	<style>
			* {box-sizing: border-box}
			body {font-family: Verdana, sans-serif; margin:0}
			.mySlides {display: none}
			img {vertical-align: middle;}

		/* Slideshow container */
			.slideshow-container {
 			 max-width: 80%;
 			 position: relative;
 			 margin: auto;
			}

		/* Next & previous buttons */
			.prev, .next {
			cursor: pointer;
  			position: absolute;
 			top: 50%;
  			width: auto;
  			padding: 16px;
  			margin-top: -22px;
  			color: white;
  			font-weight: bold;
 			font-size: 18px;
  			transition: 0.6s ease;
  			border-radius: 0 3px 3px 0;
  			user-select: none;
			}

		/* Position the "next button" to the right */
			.next {
  			right: 0;
 	 		border-radius: 3px 0 0 3px;
			}

		/* On hover, add a black background color with a little bit see-through */
			.prev:hover, .next:hover {
  			background-color: rgba(0,0,0,0.8);
			}

		/* Caption text */
			.text {
  			color: #000000;
  			font-size: 15px;
  			padding: 8px 12px;
  			position: absolute;
 			bottom: 8px;
  			width: 100%;
  			text-align: center;
  			font-weight: bold;
			}

			.text1 {
  			
			}

		/* Number text (1/3 etc) */
			.numbertext {
  			color: #f2f2f2;
  			font-size: 12px;
  			padding: 8px 12px;
 			position: absolute;
  			top: 0;
			}

		/* The dots/bullets/indicators */
			.dot {
  			cursor: pointer;
  			height: 15px;
  			width: 15px;
  			margin: 0 2px;
  			background-color: #bbb;
  			border-radius: 50%;
  			display: inline-block;
  			transition: background-color 0.6s ease;
			}

			.active, .dot:hover {
  			background-color: #717171;
			}

		/* Fading animation */
			.fade {
  			-webkit-animation-name: fade;
  			-webkit-animation-duration: 1.5s;
  			animation-name: fade;
  			animation-duration: 1.5s;
			}

			@-webkit-keyframes fade {
  			from {opacity: .4} 
  			to {opacity: 1}
			}

			@keyframes fade {
  			from {opacity: .4} 
  			to {opacity: 1}
			}

		/* On smaller screens, decrease text size */
			@media only screen and (max-width: 300px) {
  			.prev, .next,.text {font-size: 11px}
			}
	</style>
</head>
<body>

		<div class="slideshow-container">

		<div class="mySlides fade">
 			<div class="numbertext">1 / 3</div>
  			<img src="imagens/MARKET.png" style="width:100%">
  		<div class="text">Bem-vindo ao nosso site!</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">2 / 3</div>
  <img src="img_snow_wide.jpg" style="width:100%">
  <div class="text">Conheça Nosso Site!</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">3 / 3</div>
  <img src="web.png" style="width:100%">
</div>

<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
<a class="next" onclick="plusSlides(1)">&#10095;</a>

</div>
<br>

<div style="text-align:center">
  <span class="dot" onclick="currentSlide(1)"></span> 
  <span class="dot" onclick="currentSlide(2)"></span> 
  <span class="dot" onclick="currentSlide(3)"></span> 
</div>

<script>
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 2 seconds
}
</script>
		<!-- FIM BANNER -->

<div>
	<?PHP
		for($contador=0; $contador < $total_registros; $contador++) {
			$reg = mysqli_fetch_array($rs); 
			$prod_id = $reg["prod_id"];
			$nome_prod = $reg["nome"];
			$stt_produto = $reg["stt_produto"];
			$valor = $reg["valor"];
				
			// Exibe dados da coluna esquerda 
			if ($contador % 2 == 0) {
	?>
				<div class="produtos">
					<td >
						<a href="#"><img src="imagens/<?PHP print $nome_prod; ?>.jpg" width="200" height="250" border="0" /></a><br />
					<td >
						<span class="nome"><?PHP print $nome_prod; ?></span><br />
						<span class="valor">R$ <?PHP print number_format($valor,2,',','.'); ?></span><br />
						<br>
						<button class="comp">Comprar</button>
						<form name="carrinho" method="post" action="opcarrinho.php">
   							<input type="hidden" name="prod_id" value="<?PHP print $prod_id; ?>">
   							<input type="submit" name="btn_envio" value="Carrinho" class="carr">
						</form>
						<!---
						<form action="opcarrinho.php">
							<a href="carrinho.php?prod_id=<?PHP print $prod_id; ?>" ><button type="submit" class="carr">Carrinho</button></a>
						</form>
					-->
					</td>
					</td>
				</div>
	<?PHP
			// Exibe dados da coluna direita 
			} 
			else 
			{ 
	?>
				<div class="produtos">
				<td >
					<a href="#">
						<img src="imagens/<?PHP print $nome_prod; ?>.jpg" width="200" height="250" border="0" />
					</a><br />
				</td>
				<td >
					<span class="nome"><?PHP print $nome_prod; ?></span><br />
					<span class="valor">R$ <?PHP print number_format($valor,2,',','.'); ?></span><br />
					<br>
					<button class="comp">Comprar</button>
					<form name="carrinho" method="post" action="opcarrinho.php">
   						<input type="hidden" name="prod_id" value="<?PHP print $prod_id; ?>">
   						<input type="submit" name="btn_envio" value="Carrinho" class="carr">
					</form>
				</td>
			</div>

			<tr>
				<td colspan="4">&nbsp;</td>
			</tr>
<?PHP
			}
		}
?>
</div>
	<br>
		<div class="rodape">
			<img src="imagens/logo.png">
			<div class="cartoes">
				<img src="cartoes.png">
			</div>
			<div class="links">
				<a href="quemsomos.php">Quem somos |</a>
				<a href="">Termos de Uso |</a>
				<a href="">Ambiente Seguro</a>
			</div>
		</div>
	</body>
</html> 