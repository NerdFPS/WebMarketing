/** Uma linha de cupom fiscal: descrição, pontilhado e valor. */
export default function LinhaRecibo({ rotulo, valor, className = 'recibo__linha' }) {
  return (
    <p className={className}>
      <span>{rotulo}</span>
      <span className="pontilhado" aria-hidden="true" />
      <span>{valor}</span>
    </p>
  );
}
