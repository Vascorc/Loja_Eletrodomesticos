import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './MinhaConta.css';

const MinhaConta = () => {
  const [user, setUser] = useState(null);
  const [historico, setHistorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      fetch('http://localhost:8080/api/vendas/historico', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.ok ? res.json() : [])
      .then(data => setHistorico(data))
      .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  if (!user) return <div className="loading">A carregar...</div>;

  const canManageProducts = user.perfil === 'ADMIN' || user.perfil === 'GESTOR';

  return (
    <div className="minhaconta-page">
      <nav className="dashboard-nav">
        <div className="nav-top">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>ELECTRO-SD</Link>
          
          <div className="nav-actions">
            <Link to="/produtos" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>⬅ Voltar</span>
              <span>à Loja</span>
            </Link>
            <span onClick={handleLogout} className="logout-link">Sair</span>
          </div>
        </div>
      </nav>

      <main className="minhaconta-content">
        <section className="profile-header">
          <h1>Minha Conta</h1>
          <p>Bem-vindo, {user.nome}</p>
        </section>

        <div className="account-sections">
          <div className="account-card">
            <h3>Meus Dados</h3>
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Cargo:</strong> {user.perfil}</p>
          </div>

          <div className="account-card" style={{ flexBasis: '100%' }}>
            <h3>Histórico de Compras</h3>
            {historico.length === 0 ? (
                <p>Ainda não tens encomendas registadas.</p>
            ) : (
                <table className="historico-table" style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
                            <th style={{ padding: '0.5rem' }}>Data</th>
                            <th style={{ padding: '0.5rem' }}>Total</th>
                            <th style={{ padding: '0.5rem' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.map(venda => (
                            <tr key={venda.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '0.5rem' }}>{new Date(venda.dataVenda).toLocaleString()}</td>
                                <td style={{ padding: '0.5rem' }}>{venda.valorTotal.toFixed(2)} €</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <button 
                                        onClick={() => navigate('/fatura', { state: { faturaId: venda.id } })}
                                        style={{ background: '#2196F3', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Ver Fatura
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>

          {canManageProducts && (
            <div className="account-card admin-card">
              <h3>Administração</h3>
              <p>Tens permissões de gestão.</p>
              <button className="admin-btn">Adicionar Produtos</button>
              <button className="admin-btn">Gerir Produtos</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhaConta;
