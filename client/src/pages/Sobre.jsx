const EQUIPE = [
  { nome: 'Tiago de Assis Gonçalves Fernandes', foto: 'tiago.jpg', funcao: 'Design do projeto' },
  { nome: 'Sandro Henrique de Amorim Guedes', foto: 'sandro.jpg', funcao: 'Design' },
  { nome: 'Vitor Elias Alves Amorim', foto: 'vitor.jpg', funcao: 'Programação em PHP, banco de dados e documentação' },
  { nome: 'Igor Miguel Morais Campos', foto: 'igor.jpg', funcao: 'Banco de dados e documentação' },
];

export default function Sobre() {
  return (
    <div className="container">
      <header className="titulo-pagina">
        <h1>Quem somos</h1>
        <p>
          O Web Market nasceu como trabalho de conclusão do curso de Informática para Internet: um supermercado
          online onde você escolhe seus produtos por setor, monta o carrinho e recebe tudo em casa.
        </p>
      </header>

      <section aria-labelledby="titulo-equipe">
        <h2 id="titulo-equipe">Nossa equipe</h2>
        <ul className="equipe">
          {EQUIPE.map((pessoa) => (
            <li key={pessoa.nome} className="membro">
              <img src={`/images/equipe/${pessoa.foto}`} alt={`Foto de ${pessoa.nome}`} loading="lazy" />
              <h3>{pessoa.nome}</h3>
              <p>{pessoa.funcao}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
