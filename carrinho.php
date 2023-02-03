<?php
	session_start();
	include ("Conexao.php");

	if(!empty($_SESSION['prod_id']) && is_numeric($_SESSION['prod_id'])) 
	{
  		if(!isset($_SESSION['carrinho'])) 
  		{
     		$_SESSION['carrinho'] = array();
  		}
  		$_SESSION['carrinho'][] = $_SESSION['prod_id'];
	}
?>

<!DOCTYPE html>
<html>
<head>
	<title>Carrinho</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="shortcut icon" href="logo.ico" type="image/x-icon" />
	<link rel="stylesheet" type="text/css" href="carrinhoCss.css">
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
			 <a href="cadastro.php#paralogin"><img src="imagens/login-img.png"></a>
		</div>
	</div>
	<br>
	<!-- FIM MENU SUPERIOR -->
	<!-- Carrinho -->
	<div class="produtos">
	<?php
		
		foreach($_SESSION['carrinho'] as $key => $value)
		{
			$sql = "SELECT * ";
			$sql = $sql . " FROM produtos ";
			$sql = $sql . " WHERE prod_id = $value ";

			$rs = mysqli_query($Conexao, $sql);
			$reg = @mysqli_fetch_array($rs);
 			//aqui monta o produto para exibição do carrinho... faz query no banco pegando os produtos pelo id que está na variável $value
	?>
  		<div class="separacao">
  			<div class="foto">
  				<img src="imagens/<?php print @$reg['nome']; ?>.jpg">
  			</div>

			<div class="prot">
				<h3><?php print @$reg['nome'] ?></h3>
			</div>

			<div class="quantidade">
 		 		<input type="number" id="points" name="points" step="1" value="1">
 		 	</div>

			<div class="preco">
				<h4><?PHP print number_format(@$reg['valor'],2,',','.'); ?></h4>
			</div>
		</div>
	<?php
		}
	?>
	</div>
	<!-- Fim Carrinho -->
	<!-- Rodapé -->
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
	<!-- Fim Rodapé -->
</body>
</html>