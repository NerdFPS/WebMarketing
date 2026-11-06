/** Setores da loja (os mesmos slugs usados pela API). */
export const CATEGORIAS = [
  { slug: 'laticinios', nome: 'Laticínios', descricao: 'Leites, iogurtes e derivados.' },
  { slug: 'alimenticios', nome: 'Alimentícios', descricao: 'Mercearia, carnes e bebidas.' },
  { slug: 'utensilios', nome: 'Utensílios', descricao: 'Tudo para a limpeza e a casa.' },
  { slug: 'higiene', nome: 'Higiene', descricao: 'Cuidados pessoais para toda a família.' },
];

export const nomeCategoria = (slug) => CATEGORIAS.find((c) => c.slug === slug)?.nome;
