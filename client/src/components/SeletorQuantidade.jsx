import { MAX_POR_ITEM } from '../utils/carrinho.js';

export default function SeletorQuantidade({ valor, onChange, maximo = MAX_POR_ITEM, rotulo = 'Quantidade' }) {
  return (
    <div className="quantidade" role="group" aria-label={rotulo}>
      <button type="button" aria-label="Diminuir" onClick={() => onChange(valor - 1)} disabled={valor <= 1}>
        −
      </button>
      <input
        type="number"
        min="1"
        max={maximo}
        value={valor}
        aria-label={rotulo}
        onChange={(e) => onChange(Math.min(maximo, Math.max(1, Number(e.target.value) || 1)))}
      />
      <button type="button" aria-label="Aumentar" onClick={() => onChange(valor + 1)} disabled={valor >= maximo}>
        +
      </button>
    </div>
  );
}
