import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { abrirBanco } from '../src/db.js';
import { criarApp } from '../src/app.js';
import { cpfValido } from '../src/validacao.js';

let servidor;
let base;

before(async () => {
  const app = criarApp(abrirBanco(':memory:'));
  await new Promise((ok) => {
    servidor = app.listen(0, ok);
  });
  base = `http://localhost:${servidor.address().port}/api`;
});

after(() => servidor.close());

/** Pequeno cliente HTTP que guarda o cookie de sessão. */
function novoCliente() {
  let cookie = '';
  return async (metodo, caminho, corpo) => {
    const resposta = await fetch(base + caminho, {
      method: metodo,
      headers: {
        ...(corpo ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const setCookie = resposta.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    const texto = await resposta.text();
    return { status: resposta.status, corpo: texto ? JSON.parse(texto) : null };
  };
}

const CPF_TESTE = '529.982.247-25';
const cadastro = {
  login: 'maria',
  senha: 'senhaforte123',
  nome: 'Maria Silva',
  cpf: CPF_TESTE,
  cep: '12602-570',
  endereco: 'Rua Professor Joaquim Ferreira Pedro, 68',
  celular: '(12) 99602-4269',
};

test('validação de CPF', () => {
  assert.equal(cpfValido(CPF_TESTE), true);
  assert.equal(cpfValido('111.111.111-11'), false);
  assert.equal(cpfValido('529.982.247-24'), false);
});

test('lista, filtra, busca e ordena produtos', async () => {
  const api = novoCliente();

  const todos = await api('GET', '/produtos');
  assert.equal(todos.status, 200);
  assert.ok(todos.corpo.length >= 9);

  const higiene = await api('GET', '/produtos?categoria=higiene');
  assert.ok(higiene.corpo.every((p) => p.categoria === 'higiene'));

  const busca = await api('GET', '/produtos?q=NESCAU');
  assert.deepEqual(busca.corpo.map((p) => p.slug), ['nescau']);

  const baratos = await api('GET', '/produtos?ordenar=preco_asc');
  const precos = baratos.corpo.map((p) => p.preco_centavos);
  assert.deepEqual(precos, [...precos].sort((a, b) => a - b));

  // Texto arbitrário em "ordenar" não chega ao SQL (antes era injeção de SQL).
  const ataque = await api('GET', '/produtos?ordenar=valor;DROP TABLE produtos');
  assert.equal(ataque.status, 200);

  assert.equal((await api('GET', '/produtos/leite')).corpo.slug, 'leite');
  assert.equal((await api('GET', '/produtos/nao-existe')).status, 404);
});

test('cadastro, login, perfil e exclusão de conta', async () => {
  const api = novoCliente();

  const invalido = await api('POST', '/auth/cadastro', { ...cadastro, cpf: '123', senha: '123' });
  assert.equal(invalido.status, 400);
  assert.ok(invalido.corpo.campos.cpf);
  assert.ok(invalido.corpo.campos.senha);

  const criado = await api('POST', '/auth/cadastro', cadastro);
  assert.equal(criado.status, 201);
  assert.equal(criado.corpo.cpf, '52998224725');
  assert.equal(criado.corpo.senha_hash, undefined, 'hash da senha nunca sai da API');

  const repetido = await novoCliente()('POST', '/auth/cadastro', cadastro);
  assert.equal(repetido.status, 409);

  assert.equal((await api('GET', '/auth/eu')).corpo.login, 'maria');

  const editado = await api('PUT', '/conta', { ...cadastro, nome: 'Maria S.' });
  assert.equal(editado.corpo.nome, 'Maria S.');

  assert.equal((await api('POST', '/auth/logout')).status, 204);
  assert.equal((await api('GET', '/auth/eu')).corpo, null);

  assert.equal((await api('POST', '/auth/login', { login: 'maria', senha: 'errada123' })).status, 401);
  assert.equal((await api('POST', '/auth/login', { login: 'maria', senha: cadastro.senha })).status, 200);

  assert.equal((await api('DELETE', '/conta')).status, 204);
  assert.equal((await api('POST', '/auth/login', { login: 'maria', senha: cadastro.senha })).status, 401);
});

test('pedido usa preço do banco e baixa o estoque', async () => {
  const api = novoCliente();
  await api('POST', '/auth/cadastro', { ...cadastro, login: 'joao', cpf: '111.444.777-35' });

  const leite = (await api('GET', '/produtos/leite')).corpo;
  const sabonete = (await api('GET', '/produtos/sabonete')).corpo;

  const pedido = await api('POST', '/pedidos', {
    formaPagamento: 'pix',
    itens: [
      { produtoId: leite.id, quantidade: 2, preco_centavos: 1 }, // preço falso é ignorado
      { produtoId: sabonete.id, quantidade: 1 },
    ],
  });
  assert.equal(pedido.status, 201);
  assert.equal(pedido.corpo.total_centavos, leite.preco_centavos * 2 + sabonete.preco_centavos);
  assert.equal(pedido.corpo.itens.length, 2);

  assert.equal((await api('GET', '/produtos/leite')).corpo.estoque, leite.estoque - 2);
  assert.equal((await api('GET', '/pedidos')).corpo.length, 1);

  assert.equal((await api('POST', '/pedidos', { formaPagamento: 'dinheiro', itens: [] })).status, 400);
  assert.equal((await api('POST', '/pedidos', { formaPagamento: 'pix', itens: [{ produtoId: leite.id, quantidade: 11 }] })).status, 400);
  assert.equal((await novoCliente()('POST', '/pedidos', { formaPagamento: 'pix', itens: [] })).status, 401);
});

test('estoque insuficiente desfaz o pedido inteiro', async () => {
  const api = novoCliente();
  await api('POST', '/auth/cadastro', { ...cadastro, login: 'ana', cpf: '935.411.347-80' });

  const peru = (await api('GET', '/produtos/peru-facil')).corpo; // 15 em estoque
  const shampoo = (await api('GET', '/produtos/shampoo')).corpo;

  await api('POST', '/pedidos', { formaPagamento: 'pix', itens: [{ produtoId: peru.id, quantidade: 10 }] });
  const falha = await api('POST', '/pedidos', {
    formaPagamento: 'pix',
    itens: [{ produtoId: shampoo.id, quantidade: 1 }, { produtoId: peru.id, quantidade: 10 }],
  });
  assert.equal(falha.status, 409);
  assert.equal((await api('GET', '/produtos/shampoo')).corpo.estoque, shampoo.estoque, 'estoque do shampoo não muda');
});

test('bloqueia o login depois de muitas senhas erradas', async () => {
  const api = novoCliente();
  await api('POST', '/auth/cadastro', { ...cadastro, login: 'bia', cpf: '390.533.447-05' });
  await api('POST', '/auth/logout');

  for (let i = 0; i < 5; i++) {
    assert.equal((await api('POST', '/auth/login', { login: 'bia', senha: 'errada' + i })).status, 401);
  }
  const bloqueado = await api('POST', '/auth/login', { login: 'bia', senha: cadastro.senha });
  assert.equal(bloqueado.status, 429, 'nem a senha certa passa durante o bloqueio');
});

test('limite de tentativas libera depois da janela', async () => {
  const { criarLimiteTentativas } = await import('../src/limiteTentativas.js');
  let relogio = 0;
  const limite = criarLimiteTentativas({ maximo: 2, janelaMs: 1000, agora: () => relogio });
  limite.registrarFalha('x');
  limite.registrarFalha('x');
  assert.ok(limite.bloqueadoPor('x') > 0);
  relogio = 1001;
  assert.equal(limite.bloqueadoPor('x'), 0);
});

test('rejeita escrita que não seja JSON', async () => {
  const resposta = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'login=x&senha=y',
  });
  assert.equal(resposta.status, 415);
});
