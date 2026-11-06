const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 1549 → "R$ 15,49" */
export const formatarPreco = (centavos) => moeda.format(centavos / 100);

export const somenteDigitos = (v) => String(v ?? '').replace(/\D/g, '');

/** Aplica uma máscara onde "9" é um dígito: mascarar('12602570', '99999-999') → '12602-570' */
export function mascarar(valor, mascara) {
  const digitos = somenteDigitos(valor);
  let resultado = '';
  let i = 0;
  for (const c of mascara) {
    if (i >= digitos.length) break;
    if (c === '9') resultado += digitos[i++];
    else resultado += c;
  }
  return resultado;
}

export const mascaraCpf = (v) => mascarar(v, '999.999.999-99');
export const mascaraCep = (v) => mascarar(v, '99999-999');
export const mascaraCelular = (v) =>
  somenteDigitos(v).length > 10 ? mascarar(v, '(99) 99999-9999') : mascarar(v, '(99) 9999-9999');

export const FORMAS_PAGAMENTO = {
  pix: 'Pix',
  boleto: 'Boleto',
  cartao: 'Cartão na entrega',
};

/** "2026-11-06 14:03:00" (UTC do SQLite) → "06/11/2026 11:03" */
export function formatarData(dataSqlite) {
  const data = new Date(`${dataSqlite.replace(' ', 'T')}Z`);
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
