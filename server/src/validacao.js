/** Remove tudo que não for dígito. */
export const somenteDigitos = (valor) => String(valor ?? '').replace(/\D/g, '');

/** Valida CPF pelos dígitos verificadores. */
export function cpfValido(valor) {
  const cpf = somenteDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digito = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

const texto = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Valida e normaliza os dados de perfil (cadastro e edição).
 * Retorna { dados, erros } — `erros` é um objeto campo → mensagem.
 */
export function validarPerfil(entrada, { cadastro }) {
  const erros = {};
  const dados = {
    nome: texto(entrada.nome),
    cep: somenteDigitos(entrada.cep),
    endereco: texto(entrada.endereco),
    celular: somenteDigitos(entrada.celular),
  };

  if (dados.nome.length < 2 || dados.nome.length > 80) erros.nome = 'Informe seu nome (2 a 80 caracteres).';
  if (dados.cep.length !== 8) erros.cep = 'CEP deve ter 8 dígitos.';
  if (dados.endereco.length < 5 || dados.endereco.length > 150) erros.endereco = 'Informe o endereço com número.';
  if (dados.celular.length < 10 || dados.celular.length > 11) erros.celular = 'Celular deve ter DDD + número.';

  if (cadastro) {
    dados.login = texto(entrada.login);
    dados.senha = typeof entrada.senha === 'string' ? entrada.senha : '';
    dados.cpf = somenteDigitos(entrada.cpf);

    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(dados.login)) {
      erros.login = 'Login deve ter 3 a 30 caracteres (letras, números, "_" ou ".").';
    }
    if (dados.senha.length < 8 || dados.senha.length > 128) erros.senha = 'Senha deve ter no mínimo 8 caracteres.';
    if (!cpfValido(dados.cpf)) erros.cpf = 'CPF inválido.';
  }

  return { dados, erros };
}

export const FORMAS_PAGAMENTO = ['pix', 'boleto', 'cartao'];
