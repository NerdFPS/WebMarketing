import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useApi } from '../hooks/useApi.js';
import CamposEndereco from '../components/CamposEndereco.jsx';
import Estado from '../components/Estado.jsx';
import { FORMAS_PAGAMENTO, formatarData, formatarPreco, mascaraCelular, mascaraCep, mascaraCpf } from '../utils/formatar.js';

export default function MinhaConta() {
  const { cliente, atualizar, sair, excluirConta } = useAuth();
  const avisar = useToast();
  const navegar = useNavigate();
  const pedidos = useApi(() => api.pedidos(), []);

  const [form, setForm] = useState({
    nome: cliente.nome,
    cep: mascaraCep(cliente.cep),
    endereco: cliente.endereco,
    celular: mascaraCelular(cliente.celular),
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErros({});
    try {
      await atualizar(form);
      avisar('Dados atualizados.');
    } catch (e) {
      setErros(e.campos ?? {});
      avisar(e.message, 'erro');
    } finally {
      setSalvando(false);
    }
  }

  async function sairDaConta() {
    await sair();
    navegar('/');
  }

  async function excluir() {
    const confirmado = window.confirm(
      'Tem certeza que deseja excluir sua conta? Seus dados e pedidos serão apagados. Essa ação não pode ser desfeita.',
    );
    if (!confirmado) return;
    try {
      await excluirConta();
      avisar('Conta excluída.');
      navegar('/');
    } catch (e) {
      avisar(e.message, 'erro');
    }
  }

  return (
    <div className="container">
      <header className="titulo-pagina titulo-pagina--linha">
        <div>
          <h1>Minha conta</h1>
          <p>
            {cliente.login} · CPF {mascaraCpf(cliente.cpf)}
          </p>
        </div>
        <button className="botao" onClick={sairDaConta}>
          Sair
        </button>
      </header>

      <div className="conta">
        <form className="formulario formulario--cartao" onSubmit={salvar} noValidate>
          <h2>Meus dados</h2>
          <CamposEndereco form={form} setForm={setForm} erros={erros} />
          <button className="botao botao--primario" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar alterações'}
          </button>
          <hr />
          <button type="button" className="botao botao--perigo" onClick={excluir}>
            Excluir minha conta
          </button>
        </form>

        <section className="pedidos" aria-labelledby="titulo-pedidos">
          <h2 id="titulo-pedidos">Meus pedidos</h2>
          {pedidos.carregando && <Estado tipo="carregando" />}
          {pedidos.erro && <Estado tipo="erro" mensagem={pedidos.erro.message} />}
          {pedidos.dados?.length === 0 && <Estado mensagem="Você ainda não fez nenhum pedido." />}
          {pedidos.dados?.map((p) => (
            <details key={p.id} className="pedido">
              <summary>
                <span>Pedido nº {p.id}</span>
                <span>{formatarData(p.criado_em)}</span>
                <span className="etiqueta">{p.status}</span>
                <strong>{formatarPreco(p.total_centavos)}</strong>
              </summary>
              <ul>
                {p.itens.map((i) => (
                  <li key={i.produto_id}>
                    {i.quantidade}× {i.nome} — {formatarPreco(i.preco_centavos * i.quantidade)}
                  </li>
                ))}
              </ul>
              <p className="pedido__pagamento">Pagamento: {FORMAS_PAGAMENTO[p.forma_pagamento]}</p>
            </details>
          ))}
        </section>
      </div>
    </div>
  );
}
