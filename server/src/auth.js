import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export const COOKIE_SESSAO = 'wm_sessao';
const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

/** Gera o hash da senha com scrypt e sal aleatório: "sal:hash" em hex. */
export function hashSenha(senha) {
  const sal = randomBytes(16);
  const hash = scryptSync(senha, sal, 64);
  return `${sal.toString('hex')}:${hash.toString('hex')}`;
}

export function conferirSenha(senha, armazenado) {
  const [salHex, hashHex] = String(armazenado).split(':');
  if (!salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const calculado = scryptSync(senha, Buffer.from(salHex, 'hex'), esperado.length);
  return timingSafeEqual(esperado, calculado);
}

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

/** Cria uma sessão e devolve o token (só o hash fica no banco). */
export function criarSessao(db, clienteId) {
  const token = randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessoes (token_hash, cliente_id, expira_em) VALUES (?, ?, ?)')
    .run(hashToken(token), clienteId, Date.now() + DURACAO_SESSAO_MS);
  return token;
}

export function encerrarSessao(db, token) {
  if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
}

export function opcoesCookie() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DURACAO_SESSAO_MS,
    path: '/',
  };
}

/** Middleware: preenche req.cliente quando há uma sessão válida. */
export function carregarCliente(db) {
  const buscar = db.prepare(`
    SELECT c.id, c.login, c.nome, c.cpf, c.cep, c.endereco, c.celular, s.expira_em
    FROM sessoes s JOIN clientes c ON c.id = s.cliente_id
    WHERE s.token_hash = ?
  `);

  return (req, _res, next) => {
    const token = req.cookies?.[COOKIE_SESSAO];
    if (token) {
      const linha = buscar.get(hashToken(token));
      if (linha && linha.expira_em > Date.now()) {
        const { expira_em: _ignorado, ...cliente } = linha;
        req.cliente = cliente;
      } else if (linha) {
        encerrarSessao(db, token);
      }
    }
    next();
  };
}

/** Middleware: exige login. */
export function exigirLogin(req, res, next) {
  if (!req.cliente) return res.status(401).json({ erro: 'Faça login para continuar.' });
  next();
}
