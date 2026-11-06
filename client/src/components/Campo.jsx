import { useId } from 'react';

/** Campo de formulário com rótulo, dica e mensagem de erro acessíveis. */
export default function Campo({ rotulo, erro, dica, ...inputProps }) {
  const id = useId();
  const idDescricao = `${id}-descricao`;
  return (
    <div className={`campo ${erro ? 'campo--erro' : ''}`}>
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro || dica ? idDescricao : undefined}
        {...inputProps}
      />
      {(erro || dica) && (
        <small id={idDescricao} className={erro ? 'campo__erro' : 'campo__dica'}>
          {erro || dica}
        </small>
      )}
    </div>
  );
}
