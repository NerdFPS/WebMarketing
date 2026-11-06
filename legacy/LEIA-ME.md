# Versão original (PHP + MySQL)

Esta pasta guarda o código original do TCC, sem alterações, apenas para consulta.
A versão atual do projeto está em `client/` (React) e `server/` (Node.js). Veja o README na raiz.

Para rodar esta versão antiga seria preciso um servidor PHP com MySQL (por exemplo, XAMPP),
importar `webmarket.sql` e ajustar `Conexao.php`.

> Atenção: esta versão tem falhas de segurança conhecidas (senhas em texto puro,
> injeção de SQL na ordenação, número de cartão salvo no banco). Não a publique na internet.
