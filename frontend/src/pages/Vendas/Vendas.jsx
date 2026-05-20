import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendaService } from '../../services/vendaService';
import Navbar from '../../components/Navbar/Navbar';
import './Vendas.css';

const Vendas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    vendaService.listarTodas()
      .then(setVendas)
      .catch(() => setErro('Erro ao carregar vendas. Verifique se o servidor está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vendas-page">
      <Navbar />
      <main className="vendas-main">
        <div className="vendas-header">
          <div>
            <h1>Histórico de Vendas</h1>
            <p>{vendas.length} venda{vendas.length !== 1 ? 's' : ''} registada{vendas.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-voltar" onClick={() => navigate('/minha-conta')}>
            Voltar para Minha Conta
          </button>
        </div>

        {loading ? (
          <div className="vendas-estado">
            <div className="spinner"></div>
            <p>A carregar vendas...</p>
          </div>
        ) : erro ? (
          <div className="vendas-estado erro-msg">{erro}</div>
        ) : vendas.length === 0 ? (
          <div className="vendas-estado vazio">
            <p>Não há vendas registadas neste momento.</p>
          </div>
        ) : (
          <div className="vendas-lista">
            {vendas.map(venda => (
              <div key={venda.id} className="venda-card">
                <div className="venda-topo">
                  <div>
                    <strong>Venda #{venda.id}</strong>
                    <p>{new Date(venda.dataVenda).toLocaleString('pt-PT')}</p>
                  </div>
                  <div className="venda-total">
                    <span>Total</span>
                    <strong>{venda.valorTotal.toFixed(2)} €</strong>
                  </div>
                </div>

                <div className="venda-meta">
                  <span>{venda.clienteNome || venda.clienteEmail}</span>
                  <span>{venda.clienteEmail}</span>
                </div>

                <div className="venda-itens">
                  {venda.itens.map((item, index) => (
                    <div key={index} className="venda-item">
                      <span>{item.produtoNome}</span>
                      <span>{item.quantidade} × {item.precoUnitario.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Vendas;
