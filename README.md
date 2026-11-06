# Web Market

Loja virtual de supermercado, criada como trabalho de conclusão do curso de **Informática para Internet**.
Esta versão 2.0 é uma reescrita completa da versão original (PHP + MySQL) usando **React** no front-end e **Node.js** no back-end.

## Funcionalidades

- **Catálogo** com setores (Laticínios, Alimentícios, Utensílios, Higiene), página de produto e ordenação por nome ou preço
- **Busca** por nome, marca ou descrição (ignora acentos e maiúsculas)
- **Carrinho** que continua salvo ao recarregar a página, com quantidade, remoção e subtotal
- **Pedidos**: escolha da forma de pagamento (Pix, boleto ou cartão na entrega), baixa de estoque e histórico em *Minha conta*
- **Contas**: cadastro com validação de CPF, CEP e celular, preenchimento automático do endereço pelo CEP ([ViaCEP](https://viacep.com.br)), login, edição de dados e exclusão da conta
- **Layout responsivo** (celular, tablet e computador), acessível por teclado e leitor de tela
- Banner rotativo com setas, indicadores e pausa ao passar o mouse

## Design

O site é o **material impresso de um supermercado**. A página inicial é a capa de um *encarte de ofertas*: papel branco sobre a foto de uma feira, preços em etiquetas amarelas cortadas no mesmo ângulo do logo W. O carrinho, o pedido confirmado e o "como funciona" são *cupons fiscais* com a borda serrilhada.

- **Cores:** vermelho e preto da marca, amarelo de etiqueta de preço, papel branco
- **Tipografia:** Archivo (uma só família): larga e condensada nos títulos e preços, como o logo; normal nos textos
- **Listas prontas:** cupons como "Café da manhã" ou "Noite de TCC" vão inteiros para o carrinho com um clique
- **Setores:** a palavra "Setores" fica fixa enquanto a lista de produtos rola ao lado
- **Movimento:** os elementos entram suavemente ao rolar, e a foto da capa se move devagar. Quem ativa "reduzir movimento" no sistema vê tudo parado.

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Front-end | React 19, React Router 7, Vite |
| Back-end | Node.js, Express 5 |
| Banco de dados | SQLite (`node:sqlite`, embutido no Node, sem instalar nada) |
| Testes | `node:test` (API) e Vitest (front-end) |

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 22.13 ou mais novo.

```bash
npm install
npm run dev
```

Abra **http://localhost:5173**. O banco é criado sozinho em `server/data/webmarket.db` com os produtos de exemplo.

Outros comandos:

```bash
npm test          # roda os testes da API e do front-end
npm run build     # gera a versão de produção do React em client/dist
npm start         # servidor único (API + site compilado) em http://localhost:3001
```

## Estrutura

```
web-market/
├── client/                 Front-end React
│   ├── public/images/      Imagens dos produtos, equipe e banners
│   └── src/
│       ├── components/     Cabeçalho, rodapé, banner, cartão de produto…
│       ├── context/        Estado global: login, carrinho e avisos
│       ├── pages/          Uma página por rota
│       ├── utils/          Formatação, máscaras e regras do carrinho (com testes)
│       ├── api.js          Todas as chamadas à API
│       └── styles/         CSS global
├── server/                 API Node.js
│   ├── src/
│   │   ├── rotas/          produtos, contas e pedidos
│   │   ├── auth.js         Senhas (scrypt) e sessões por cookie
│   │   ├── db.js           Esquema do banco SQLite
│   │   ├── seed.js         Produtos iniciais
│   │   └── validacao.js    Validação de CPF e dados de cadastro
│   └── test/               Testes da API
└── legacy/                 Versão original em PHP (preservada para consulta)
```

## API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/categorias` | Lista os setores |
| GET | `/api/produtos?categoria=&q=&ordenar=` | Lista produtos (`ordenar`: `nome`, `preco_asc`, `preco_desc`) |
| GET | `/api/produtos/:slug` | Detalhes de um produto |
| POST | `/api/auth/cadastro` | Cria conta e já faz login |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/eu` | Cliente logado (ou `null`) |
| PUT | `/api/conta` | Atualiza nome, CEP, endereço e celular |
| DELETE | `/api/conta` | Exclui a conta e os pedidos |
| GET | `/api/pedidos` | Pedidos do cliente logado |
| POST | `/api/pedidos` | Cria pedido: `{ itens: [{ produtoId, quantidade }], formaPagamento }` |

## O que mudou em relação à versão original

**Segurança**
- Senhas guardadas com hash (scrypt), nunca em texto puro
- O número do cartão de crédito **não é mais pedido nem guardado**
- Fim da injeção de SQL: a ordenação vinha direto da URL para o SQL (`?ordenar=`); agora todas as consultas usam parâmetros
- Fim do XSS no perfil: os dados eram impressos direto no HTML; o React escapa tudo
- O preço do pedido é sempre calculado no servidor, e o estoque é conferido dentro de uma transação
- Sessão em cookie `httpOnly` + `SameSite`, com proteção contra CSRF

**Correções**
- Carrinho funcionando (antes guardava só o último produto e quebrava ao abrir vazio)
- Botões "Comprar", busca e setas do banner, que não faziam nada, agora funcionam
- `cesta.php` usava tabelas que não existiam (`pedidos`, `itens`, `miniaturas`)
- CPF, CEP e celular eram guardados como número inteiro e perdiam zeros à esquerda; agora são texto validado
- Preços em centavos (inteiros), sem erro de arredondamento de `float`

**Organização**
- As 5 páginas de setor duplicadas (mesmo código copiado) viraram um único componente
- CSS repetido em cada página foi unificado num só arquivo, com variáveis de cor
- Arquivos de teste e lixo removidos (`dfgsdgd.html`, `debug.log`, imagens duplicadas)

## Equipe

- **Tiago de Assis Gonçalves Fernandes** — design do projeto
- **Sandro Henrique de Amorim Guedes** — design
- **Vitor Elias Alves Amorim** — programação em PHP, banco de dados e documentação
- **Igor Miguel Morais Campos** — banco de dados e documentação

## Créditos

- Foto da feira na capa: [“Barraca de Frutas”](https://commons.wikimedia.org/w/index.php?curid=165874722), de Rayelle da Silva Freitas, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via Wikimedia Commons (o crédito também aparece no rodapé do site)
- Fotos dos produtos, logotipo e fotos da equipe: do projeto original

> Os preços e estoques são valores de demonstração.
