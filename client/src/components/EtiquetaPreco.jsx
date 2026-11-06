/**
 * Etiqueta de preço amarela, cortada no mesmo ângulo do logo W.
 * Mostra "R$" pequeno e o valor grande, como num encarte de supermercado.
 */
export default function EtiquetaPreco({ centavos, grande = false }) {
  const [inteiro, decimal] = (centavos / 100).toFixed(2).split('.');
  const inteiroFormatado = Number(inteiro).toLocaleString('pt-BR');
  return (
    <span
      className={`etiqueta-preco ${grande ? 'etiqueta-preco--grande' : ''}`}
      aria-label={`R$ ${inteiroFormatado},${decimal}`}
    >
      <small aria-hidden="true">R$</small>
      <span aria-hidden="true">
        {inteiroFormatado},{decimal}
      </span>
    </span>
  );
}
