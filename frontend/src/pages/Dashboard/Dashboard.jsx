import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    if (currentUser && currentUser.perfil === 'ADMIN') {
        fetch('http://localhost:8080/api/estatisticas', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  if (!user) return <div className="loading">A carregar...</div>;

  const isAdmin = user.perfil === 'ADMIN';

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-top">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>ELECTRO-SD</Link>
          
          <div className="nav-actions">
            <Link to="/produtos" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Ver Catálogo</span>
            </Link>
            <Link to="/minha-conta" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Olá, {user.nome}</span>
              <span>Minha Conta</span>
            </Link>
            <Link to="/carrinho" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>🛒 Carrinho</span>
              <span>{cart.length} itens ({cartTotal.toFixed(2)} €)</span>
            </Link>
            <span onClick={handleLogout} className="logout-link">Sair</span>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="hero-banner">
          <h1>Bem-vindo à ELECTRO-SD</h1>
          <p>Os melhores eletrodomésticos com as melhores tecnologias de Sistemas Distribuídos.</p>
          <button className="btn-loja" onClick={() => navigate('/produtos')}>Explorar Catálogo</button>
        </section>

        {isAdmin && stats && (
            <div className="admin-dashboard">
                <h2>Painel de Gestão (Estatísticas)</h2>
                <div className="stats-cards">
                    <div className="stat-card">
                        <h3>Faturado Hoje</h3>
                        <p className="stat-value">{(stats.faturadoDia || 0).toFixed(2)} €</p>
                    </div>
                    <div className="stat-card">
                        <h3>Faturado Esta Semana</h3>
                        <p className="stat-value">{(stats.faturadoSemana || 0).toFixed(2)} €</p>
                    </div>
                    <div className="stat-card">
                        <h3>Faturado Este Mês</h3>
                        <p className="stat-value">{(stats.faturadoMes || 0).toFixed(2)} €</p>
                    </div>
                </div>

                <h3>Melhores Clientes</h3>
                <table className="top-clientes-table" style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
                            <th style={{ padding: '1rem' }}>Cliente</th>
                            <th style={{ padding: '1rem' }}>Total Gasto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.melhoresClientes && stats.melhoresClientes.map((c, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '1rem' }}>{c.nome}</td>
                                <td style={{ padding: '1rem', color: '#4CAF50', fontWeight: 'bold' }}>{c.totalGasto.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
