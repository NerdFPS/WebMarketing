/** Erro da API com a mensagem e os erros por campo enviados pelo servidor. */
export class ErroApi extends Error {
  constructor(mensagem, status, campos = {}) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }
}

async function requisitar(metodo, caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: metodo,
      credentials: 'same-origin',
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroApi('Não foi possível conectar ao servidor. Ele está rodando?', 0);
  }

  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    // Resposta sem JSON (ex.: proxy sem servidor) — tratada abaixo.
  }

  if (!resposta.ok) {
    throw new ErroApi(dados?.erro ?? `Erro ${resposta.status}`, resposta.status, dados?.campos);
  }
  return dados;
}

export const api = {
  categorias: () => requisitar('GET', '/categorias'),
  produtos: (filtros = {}) => {
    const params = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v));
    const qs = params.toString();
    return requisitar('GET', `/produtos${qs ? `?${qs}` : ''}`);
  },
  produto: (slug) => requisitar('GET', `/produtos/${encodeURIComponent(slug)}`),

  eu: () => requisitar('GET', '/auth/eu'),
  entrar: (login, senha) => requisitar('POST', '/auth/login', { login, senha }),
  cadastrar: (dados) => requisitar('POST', '/auth/cadastro', dados),
  sair: () => requisitar('POST', '/auth/logout'),
  atualizarConta: (dados) => requisitar('PUT', '/conta', dados),
  excluirConta: () => requisitar('DELETE', '/conta'),

  pedidos: () => requisitar('GET', '/pedidos'),
  criarPedido: (itens, formaPagamento) => requisitar('POST', '/pedidos', { itens, formaPagamento }),
};
