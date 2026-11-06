import { useState } from 'react';
import Campo from './Campo.jsx';
import { mascaraCelular, mascaraCep, somenteDigitos } from '../utils/formatar.js';

/** Busca o endereço pelo CEP no serviço público ViaCEP. */
async function buscarCep(cep) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!resposta.ok) return null;
  const dados = await resposta.json();
  if (dados.erro) return null;
  return [dados.logradouro, dados.bairro, `${dados.localidade}/${dados.uf}`].filter(Boolean).join(', ');
}

/**
 * Campos de nome, CEP, endereço e celular, compartilhados entre o cadastro
 * e a edição de perfil. Ao completar o CEP, preenche o endereço sozinho.
 */
export default function CamposEndereco({ form, setForm, erros }) {
  const [buscando, setBuscando] = useState(false);

  async function mudarCep(evento) {
    const cep = mascaraCep(evento.target.value);
    setForm((f) => ({ ...f, cep }));

    const digitos = somenteDigitos(cep);
    if (digitos.length !== 8) return;
    setBuscando(true);
    try {
      const endereco = await buscarCep(digitos);
      if (endereco) setForm((f) => ({ ...f, endereco: `${endereco}, nº ` }));
    } catch {
      // Sem internet ou ViaCEP fora do ar: o usuário digita o endereço.
    } finally {
      setBuscando(false);
    }
  }

  return (
    <>
      <Campo
        rotulo="Nome completo"
        autoComplete="name"
        required
        value={form.nome}
        erro={erros.nome}
        onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
      />
      <Campo
        rotulo="CEP"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="00000-000"
        required
        value={form.cep}
        erro={erros.cep}
        dica={buscando ? 'Buscando endereço…' : 'O endereço é preenchido automaticamente.'}
        onChange={mudarCep}
      />
      <Campo
        rotulo="Endereço (com número)"
        autoComplete="street-address"
        required
        value={form.endereco}
        erro={erros.endereco}
        onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))}
      />
      <Campo
        rotulo="Celular"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="(12) 99999-9999"
        required
        value={form.celular}
        erro={erros.celular}
        onChange={(e) => setForm((f) => ({ ...f, celular: mascaraCelular(e.target.value) }))}
      />
    </>
  );
}
