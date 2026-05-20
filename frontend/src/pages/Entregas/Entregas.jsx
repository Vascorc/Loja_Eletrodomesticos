import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { vendaService } from '../../services/vendaService';
import Navbar from '../../components/Navbar/Navbar';
import './Entregas.css';

const Entregas = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [now, setNow] = useState(Date.now());
  const [expandedId, setExpandedId] = useState(null);
  const [orderItems, setOrderItems] = useState({}); // Stores items loaded dynamically by order ID
  const [loadingItemsId, setLoadingItemsId] = useState(null);

  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const userToken = user?.token;

  // 1. Live countdown updater (every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch all user's purchases (filtered by last 7 days)
  useEffect(() => {
    if (!userToken) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErro('');
    vendaService.listarMinhas()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        // Filtro: Apenas compras efetuadas nos últimos 7 dias (7 * 24 * 60 * 60 * 1000 ms)
        const seteDiasAtras = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentes = list.filter(v => new Date(v.dataVenda).getTime() >= seteDiasAtras);

        // Ordenar por data decrescente (mais recente primeiro)
        const sorted = recentes.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda));
        setVendas(sorted);
      })
      .catch(err => {
        console.error(err);
        setErro('Não foi possível obter a lista de entregas. Verifique se o servidor está ativo.');
      })
      .finally(() => setLoading(false));
  }, [userToken, navigate]);

  // 3. Dynamically fetch items for an order if not already loaded
  const toggleExpand = async (venda) => {
    if (expandedId === venda.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(venda.id);

    // If order already has items locally or we already loaded them, skip API fetch
    if (venda.itens && venda.itens.length > 0) {
      return;
    }
    if (orderItems[venda.id]) {
      return;
    }

    // Load full invoice details (with items list)
    setLoadingItemsId(venda.id);
    try {
      const res = await fetch(`http://localhost:8080/api/vendas/${venda.id}/fatura`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrderItems(prev => ({
          ...prev,
          [venda.id]: data.itens || []
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar itens da venda:', err);
    } finally {
      setLoadingItemsId(null);
    }
  };

  if (!user) return null;

  // 4. Calculate tracking stages and countdown based on current time
  const getDeliveryTracking = (dataVendaStr) => {
    const dataVenda = new Date(dataVendaStr).getTime();
    const duration = 3 * 24 * 60 * 60 * 1000; // Exactly 3 days (72 hours) in ms
    const dataEntrega = dataVenda + duration;
    const diff = dataEntrega - now;

    if (diff <= 0) {
      return {
        isDelivered: true,
        percent: 100,
        statusText: 'Entregue',
        statusClass: 'status-delivered',
        days: 0, hours: 0, minutes: 0, seconds: 0,
        currentStage: 4 // 1: Registada, 2: Processada, 3: Em Trânsito, 4: Entregue
      };
    }

    const elapsed = now - dataVenda;
    const percent = Math.min(99, Math.max(0, (elapsed / duration) * 100));
    const elapsedHours = elapsed / (1000 * 60 * 60);

    let statusText = 'Encomenda Registada';
    let statusClass = 'status-processing';
    let currentStage = 1;

    if (elapsedHours >= 48) {
      statusText = 'A Caminho';
      statusClass = 'status-transit';
      currentStage = 3;
    } else if (elapsedHours >= 24) {
      statusText = 'Em Processamento';
      statusClass = 'status-processing';
      currentStage = 2;
    } else {
      statusText = 'Pagamento Confirmado';
      statusClass = 'status-registered';
      currentStage = 1;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      isDelivered: false,
      percent,
      statusText,
      statusClass,
      days, hours, minutes, seconds,
      currentStage
    };
  };

  return (
    <div className="entregas-page">
      <Navbar />

      <main className="entregas-content">
        <section className="entregas-header">
          <h1>Acompanhar Entregas</h1>
          <p>Siga o estado das suas encomendas em tempo real. Demora sempre 3 dias (72 horas) até à entrega final.</p>
        </section>

        {loading ? (
          <div className="entregas-state">
            <div className="spinner"></div>
            <p>A obter estado das entregas...</p>
          </div>
        ) : erro ? (
          <div className="entregas-state error-msg">
            <p>{erro}</p>
            <button className="btn-retry" onClick={() => window.location.reload()}>Tentar Novamente</button>
          </div>
        ) : vendas.length === 0 ? (
          <div className="entregas-state empty-state">
            <div className="empty-icon">📦</div>
            <h3>Sem encomendas nos últimos 7 dias</h3>
            <p>Não efetuou nenhuma compra nos últimos 7 dias na nossa loja.</p>
            <button className="btn-shop" onClick={() => navigate('/catalogo')}>Ir para o Catálogo</button>
          </div>
        ) : (
          <div className="entregas-list">
            {vendas.map(venda => {
              const tracking = getDeliveryTracking(venda.dataVenda);
              const expectedDate = new Date(new Date(venda.dataVenda).getTime() + 3 * 24 * 60 * 60 * 1000);
              const isExpanded = expandedId === venda.id;
              const items = orderItems[venda.id] || venda.itens || [];

              return (
                <div key={venda.id} className="entrega-card">
                  <div className="card-top-info">
                    <div className="order-meta">
                      <span className="order-id">Encomenda #{venda.id}</span>
                      <span className="order-date">
                        Comprado em: {new Date(venda.dataVenda).toLocaleDateString()} às {new Date(venda.dataVenda).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="order-badge-total">
                      <span className={`status-badge ${tracking.statusClass}`}>
                        {tracking.isDelivered ? '✓ ' : '🚚 '}{tracking.statusText}
                      </span>
                      <span className="order-total">{venda.valorTotal.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Progressive visual bar container */}
                  <div className="progress-timeline-container">
                    <div className="progress-bar-background">
                      <div className="progress-bar-fill" style={{ width: `${tracking.percent}%` }}></div>
                    </div>
                    
                    <div className="timeline-stages">
                      <div className={`stage-node ${tracking.currentStage >= 1 ? 'active' : ''}`}>
                        <div className="node-dot">1</div>
                        <span className="node-label">Registada</span>
                      </div>
                      <div className={`stage-node ${tracking.currentStage >= 2 ? 'active' : ''}`}>
                        <div className="node-dot">2</div>
                        <span className="node-label">Processada</span>
                      </div>
                      <div className={`stage-node ${tracking.currentStage >= 3 ? 'active' : ''}`}>
                        <div className="node-dot">3</div>
                        <span className="node-label">A Caminho</span>
                      </div>
                      <div className={`stage-node ${tracking.currentStage >= 4 ? 'active' : ''}`}>
                        <div className="node-dot">4</div>
                        <span className="node-label">Entregue</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery ETA info box */}
                  <div className="eta-info-box">
                    {tracking.isDelivered ? (
                      <p className="eta-delivered-msg">
                        🎉 <strong>Entregue!</strong> O seu pedido foi entregue com sucesso em <strong>{expectedDate.toLocaleDateString()}</strong> às <strong>{expectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.
                      </p>
                    ) : (
                      <div className="eta-countdown-wrapper">
                        <p className="eta-date">
                          📅 <strong>Previsão de entrega:</strong> {expectedDate.toLocaleDateString()} às {expectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="countdown-timer">
                          <span className="countdown-title">Tempo Restante:</span>
                          <span className="timer-unit"><strong>{tracking.days}</strong>d</span>
                          <span className="timer-unit"><strong>{tracking.hours}</strong>h</span>
                          <span className="timer-unit"><strong>{tracking.minutes}</strong>m</span>
                          <span className="timer-unit"><strong>{tracking.seconds}</strong>s</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="card-actions">
                    <button 
                      onClick={() => toggleExpand(venda)} 
                      className="btn-details-toggle"
                    >
                      {isExpanded ? 'Ocultar Detalhes ▲' : 'Ver Detalhes do Pedido ▼'}
                    </button>
                    <button 
                      onClick={() => navigate('/fatura', { state: { faturaId: venda.id } })} 
                      className="btn-fatura-link"
                    >
                      📄 Ver Fatura
                    </button>
                  </div>

                  {/* Expanded details of products */}
                  {isExpanded && (
                    <div className="expanded-details-area">
                      <h4>Artigos Comprados:</h4>
                      {loadingItemsId === venda.id ? (
                        <div className="items-spinner-wrapper">
                          <div className="spinner-small"></div>
                          <span>A obter produtos...</span>
                        </div>
                      ) : items.length === 0 ? (
                        <p className="no-items-msg">Nenhum detalhe do produto disponível.</p>
                      ) : (
                        <div className="details-items-list">
                          {items.map((item, idx) => (
                            <div key={idx} className="details-item-row">
                              <span className="item-row-name">📦 {item.produtoNome}</span>
                              <span className="item-row-qtd">Qtd: <strong>{item.quantidade}</strong></span>
                              <span className="item-row-price">{item.precoUnitario.toFixed(2)} €</span>
                              <span className="item-row-subtotal">{(item.quantidade * item.precoUnitario).toFixed(2)} €</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Entregas;
