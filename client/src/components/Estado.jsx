/** Mensagem padrão para carregamento, erro ou lista vazia. */
export default function Estado({ tipo = 'vazio', mensagem, children }) {
  if (tipo === 'carregando') {
    return (
      <div className="estado" aria-busy="true">
        <span className="spinner" aria-hidden="true" /> Carregando…
      </div>
    );
  }
  return (
    <div className={`estado ${tipo === 'erro' ? 'estado--erro' : ''}`} role={tipo === 'erro' ? 'alert' : undefined}>
      <p>{mensagem}</p>
      {children}
    </div>
  );
}
