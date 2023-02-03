<?PHP
include "Conexao.php";
SESSION_START();

// Recupera valores passados pela página detalhes.php
// onde produto = código do produto selecionado
// inserir = S - adicionado ao botão comprar da página detalhes.php
if (isset($_GET["prod_id"])) {
 $prod_id = $_GET['prod_id'];
} else {
 $produto = "";
}
// qt = 1, default para quantidade por produto passado pelo campo txtn desta página
$qt = "1";

// Captura o último id da tabela de pedidos
$sql = "SELECT compra_id, ";
$sql = $sql . " FROM compras ";
$sql = $sql . " ORDER BY compra_id DESC ";
$rs = mysqli_query($Conexao, $sql);
$reg = mysqli_fetch_array($rs);
$compra_id = $reg["compra_id"];

// Insere um registro na tabela de pedidos com o número do pedido ($num_ped)
if ($_SESSION['num_ped'] == '' and $inserir == "S") {
// Incrementa 1 ao último id
$id_ped = $id_ped + 1;
// Prepara o número do pedido (id do pedido, hora e primeiro digito do minuto)
$num_ped = $id_ped . "." . date("H") . substr(date("i"),0,1);
$_SESSION['num_ped'] = $num_ped;
$_SESSION['id_ped'] = $id_ped;

// Número do boleto = número do pedido em separador de milhar
$_SESSION['num_boleto'] = $id_ped . "." . date("H") . substr(date("i"),0,1);

$sql = " INSERT INTO pedidos ";
$sql = $sql . " (num_ped,status) ";
$sql = $sql . " VALUES('$num_ped','Em andamento') ";
$rs = mysqli_query($conexao, $sql);

$_SESSION['status'] = 'Em andamento';
}
// Excluir itens do carrinho
if (isset($_GET["excluir"])) {
 $excluir = $_GET['excluir'];
} else {
 $excluir = "";
}
if (isset($_GET["id"])) {
 $id = $_GET['id'];
} else {
 $id = "";
}
if ($excluir = "S") {
$sqld = " DELETE FROM itens ";
$sqld = $sqld . " WHERE id = '" . $id . "' ";
mysqli_query($conexao, $sqld);
}
$sql = " SELECT id, codigo, nome, preco, desconto, cor, desconto_boleto ";
$sql = $sql . " FROM miniaturas ";
$sql = $sql . " WHERE codigo = '" . $produto . "'";
$rs = mysqli_query($conexao, $sql);
$reg = mysqli_fetch_array($rs);
$codigo = $reg["codigo"];
$nome = $reg["nome"];
$preco = $reg["preco"];
$cor = $reg["cor"];
$desconto = $reg["desconto"];
$desconto_boleto = $reg["desconto_boleto"];
$preco_desconto = $preco - ($preco * $desconto / 100);
$preco_boleto = $preco_desconto - ($preco_desconto * $desconto_boleto / 100);
$num_ped = $_SESSION['num_ped'];
$sqld = " SELECT codigo";
$sqld = $sqld . " FROM itens";
$sqld = $sqld . " WHERE codigo = '" . $produto . "' ";
$sqld = $sqld . " AND num_ped= '" . $num_ped . "' ";
$rsd = mysqli_query($conexao, $sqld);
$item_duplicado = mysqli_num_rows($rsd);
if ($item_duplicado == 0 and $inserir == "S" ) 
{
	$sqli = "INSERT INTO itens ";
	$sqli = $sqli . "(num_ped, codigo, nome, qt, preco, preco_boleto, desconto, desconto_boleto) ";
	$sqli = $sqli . "VALUES('$num_ped' , '$codigo' , '$nome' , '$qt' , '$preco_desconto' , '$preco_boleto' , '$desconto' , '$desconto_boleto') ";
	mysqli_query($conexao, $sqli);
}
	for($contador=1; $contador <= $_SESSION['total_itens']; $contador++) 
	{

		if (isset($_POST['txt' . $contador])) $b[$contador] = $_POST['txt' . $contador]; else $b[$contador] = 0; 

		if (isset($_POST['id' . $contador])) $c[$contador] = $_POST['id' . $contador]; else $c[$contador] = 0; 

		$sqla = "UPDATE itens ";
		$sqla = $sqla . "SET qt = '" . $b[$contador] . "' ";
		$sqla = $sqla . "WHERE id = '" . $c[$contador] . "'";
		mysqli_query($conexao, $sqla);
	}
	$sql = "SELECT * ";
	$sql = $sql . "FROM itens ";
	$sql = $sql . "WHERE num_ped = '" . $num_ped . "' ";
	$sql = $sql . "ORDER BY id";
	$rs = mysqli_query($conexao, $sql);
	$total_itens = mysqli_num_rows($rs);
	$_SESSION['total_itens'] = $total_itens;
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<title>Faça um Site - PHP 5 com banco de dados MySQL</title>
<link href="estilo_site.css" rel="stylesheet" type="text/css" />
<script language="javascript">
function valida_form() {
<?PHP for($contador=1; $contador <= $_SESSION['total_itens']; $contador++) { ?>
if (document.cesta.txt<?PHP print $contador; ?>.value <1)
	{alert("O campo quantidade não pode ser menor do que 1.");
	document.cesta.txt<?PHP print $contador; ?>.focus();
	return false;
}
if (document.cesta.txt<?PHP print $contador; ?>.value >10)
	{alert("O campo quantidade não pode conter mais de 10 itens.");
	document.cesta.txt<?PHP print $contador; ?>.focus();
	return false;
}
<?PHP } ?>
return true;
}
</script>
</head>
<body>
<div id="corpo">
<!-- Logomarca e mneu superior -->
<div id="topo">
	<?PHP include "inc_menu_superior.php" ?>	
</div>

<!-- Menu de categorias -->		
<div id="menuSup">
	<?PHP include "inc_menu_categorias.php" ?>	
</div>

<?PHP if ($_SESSION['num_ped'] == "") { ?>
<div id="caixa">
<table width="100%" height="200" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center"><h1 class="c_vermelho">Seu carrinho está vazio </h1>
      <p class="c_vermelho"><a href="index.php"><img src="imagens/btn_voltarLoja.gif" alt="Voltar &agrave; loja" width="109" height="19" vspace="3" border="0" /></a></p></td>
  </tr>
</table>
</div>
<?PHP } else { ?>

<!-- Exibe título da página e número do pedido caso existam produtos no carrinho -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
	<td width="59%"><h1>Meu carrinho de compras</h1></td>
	<td width="41%"><div align="right">Número do seu pedido: <span class="num_pedido"><?PHP print $_SESSION['num_ped']; ?></span></div></td>
</tr>
</table>

<!-- Exibe os itens no carrinho -->
<form name="cesta" method="post" action="cesta.php" onsubmit="return valida_form(this);">	
<!-- Exibe os itens incluidos do carrinho -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
	<td class="caixa_cesta_tit">Descrição do produto </td>
	<td width="10%" class="caixa_cesta_tit"><div align="center">Quantidade</div></td>		
	<td width="10%" class="caixa_cesta_tit"><div align="center">Excluir item</div></td>
	<td width="15%" align="right" class="caixa_cesta_tit">Preço unitário R$ </td>
	<td width="15%" align="right" class="caixa_cesta_tit">Total R$ </td>
</tr>	

<?PHP
$subtotal = 0;
$n = 0;
while ($reg = mysqli_fetch_array($rs))  
{
$n = $n + 1;
$id = $reg["id"];
$codigo = $reg["codigo"];
$nome = $reg["nome"];
$qt = $reg["qt"];
$preco_unitario = $reg["preco"];
$peso = $reg["peso"];
$preco_total = $preco_unitario * $qt;
$subtotal = $subtotal + $preco_total;
?>
<tr>
	<td class="caixa_cesta_item"><img src='imagens/<?PHP print $codigo; ?>.jpg' width='53' height='32' align="absmiddle" />&nbsp;&nbsp;&nbsp;<?PHP print $codigo; ?> - <?PHP print $nome; ?></td>
	<td class="caixa_cesta_item"><div align="center"><input name="txt<?PHP print $n; ?>" value="<?PHP print $qt; ?>" type="text" size="2" maxlength="6" class="caixa_texto" /></div></td>		
	<td class="caixa_cesta_item"><div align="center"><a href="cesta.php?id=<?PHP print $id ?>&excluir=S"><img src='imagens/btn_removerItem.gif' alt='Comprar' hspace='5' border='0' /></a></div></td>
	<td align="right" class="caixa_cesta_item">R$ <?PHP print number_format($preco_unitario,2,',','.'); ?></td>
	<td align="right" class="caixa_cesta_item">R$ <?PHP print number_format($preco_total,2,',','.'); ?></td>
	<!-- Armazena id e código do item nos campos ocultos para serem capturados pelo POST do formulário -->
	<input type = hidden name="id<?PHP print $n; ?>" value="<?PHP print $id; ?>">
	<input type = hidden name="cod<?PHP print $n; ?>" value="<?PHP print $codigo; ?>">		
</tr>	
<?PHP
}
?>	

<tr>
	<td colspan="3" class="caixa_cesta_total">* O valor total da sua compra não inclui o frete, ele será calculado no fechamento do seu pedido.</td>
	<td align="right" class="caixa_cesta_total">Subtotal</td>
	<td align="right" class="caixa_cesta_total">R$ <?PHP print number_format($subtotal,2,',','.'); ?></td>
</tr>	

<!-- Exibe os botões de opções da página -->
<tr>
	<td colspan="4" class="caixa_cesta_btn">
		<a href="index.php"><img src="imagens/btn_comprarMais.gif" border="0" /></a>
		<input name="imageField" type="image" src="imagens/btn_atualizarValores.gif" /></td>
	<td class="caixa_cesta_btn"><div align="right"><a href="login.php"><img src="imagens/btn_fecharPedido.gif" alt="Fechar pedido" width="109" height="19" border="0" /></a></div>
	</td>
</tr>	
</table>
</form>
<?PHP } ?>

<!-- rodape da página -->
<?PHP include "inc_rodape.php" ?>
</div>
</body>
</html>
<?PHP
// Libera os recursos usados pela conexão atual
mysqli_free_result($rs);
mysqli_free_result($rsd);
mysqli_close ($conexao);
?>