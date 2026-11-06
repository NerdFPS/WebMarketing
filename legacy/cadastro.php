<?php
  include "Conexao.php";
  session_start()
?>
<head>
  <title>Cadastro/Login</title>
  <link rel="stylesheet" type="text/css" href="cadastro.css">
  <link rel="shortcut icon" href="logo.ico" type="image/x-icon" />
</head>
<div class="container" >
    <a class="links" id="paracadastro"></a>
    <a class="links" id="paralogin"></a>
    
    <div class="content">      
      <div id="login">
        <form method="post" action="logar.php"> 
          <h1>Login</h1> 
          <p> 
            <label for="login_log">Seu Login</label>
            <input id="login_log" name="login_log" required="required" type="text" placeholder="Jorge Morais Assis Guedes Amorim"/>
          </p>
          
          <p> 
            <label for="senha_log">Sua senha</label>
            <input id="senha_log" name="senha_log" required="required" type="password" placeholder="12345678" /> 
          </p>
          
          <p> 
            <input type="checkbox" name="manterlogado" id="manterlogado" value="" /> 
            <label for="manterlogado">Manter-me logado</label>
          </p>
          
          <p> 
            <input type="submit" value="Logar" /> 
          </p>
          
          <p class="link">
            Ainda não tem conta?
            <a href="#paracadastro">Cadastre-se</a>
          </p>
        </form>
      </div>

      <!--FORMULÁRIO DE CADASTRO-->
      <div id="cadastro">
        <form method="post" action="opCadastro.php"> 
          <h1><img src="logo.png" alt="some text" width=300 height=300></h1> 
          
          <p> 
            <label for="login_cad">Login</label>
            <input id="login_cad" name="login_cad" required="required" type="text" />
          </p>

          <p> 
            <label for="senha">Sua senha (Minimo 8 digitos)</label>
            <input id="senha" name="senha" required="required" type="password" placeholder="Ex:12345678"/>
          </p>

          <p> 
            <label for="nome">Seu nome</label>
            <input id="nome" name="nome" required="required" type="text" placeholder="Ex:Pedro" />
          </p>

          <p> 
            <label for="endereco">Endereço (obs: Indentificar número da residência)</label>
            <input id="endereco" name="endereco" required="required" type="text"  placeholder="Ex: Rua Professor Joaquim Ferreira Pedro, 68" />
          </p>

          <p> 
            <label for="CEP">CEP</label>
            <input id="CEP" name="CEP" required="required" type="text" placeholder="Ex:12602-570" />
          </p>

          <p> 
            <label for="celular">Celular</label>
            <input id="celular" name="celular" required="required" type="text" placeholder="Ex:(12) 996024269" />
          </p>

          <p> 
            <label for="CPF">CPF</label>
            <input id="CPF" name="CPF" required="required" type="text" placeholder="Ex: xxx.xxx.xxx-xx"/>
          </p>
           <p> 
            <label for="num_cartao">Número do Cartão</label>
            <input id="num_cartao" name="num_cartao" required="required" type="text" placeholder="Ex: 1234 1234 1234 1234" />
          </p>
          <p> 
            <input type="submit" value="Cadastrar"/> 
          </p>
          <p class="link">  
            Já tem conta?
            <a href="#paralogin"> Ir para Login </a>
          </p>
        </form>
      </div>
    </div>
  </div> 