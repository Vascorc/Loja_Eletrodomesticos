import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Navbar from '../../components/Navbar/Navbar';
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
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
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
      <Navbar />

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

          <div className="account-card account-card-full">
            <h3>Histórico de Compras</h3>
            {historico.length === 0 ? (
                <p>Ainda não tens encomendas registadas.</p>
            ) : (
                <div className="historico-table-wrapper">
                  <table className="historico-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historico.map(venda => (
                            <tr key={venda.id}>
                                <td>
                                    <div style={{ fontWeight: '500' }}>{new Date(venda.dataVenda).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                                        {new Date(venda.dataVenda).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td>{venda.valorTotal.toFixed(2)} €</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            type="button"
                                            className="btn-ver-fatura"
                                            onClick={() => navigate('/fatura', { state: { faturaId: venda.id } })}
                                        >
                                            Ver Fatura
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-seguir-entrega"
                                            onClick={() => navigate('/entregas')}
                                        >
                                            Seguir Entrega
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>

          {canManageProducts && (
            <div className="account-card admin-card">
              <h3>Administração</h3>
              <p>Tens permissões de gestão.</p>
              <button className="admin-btn" onClick={() => navigate('/admin/produtos')}>Gerir Produtos</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/vendas')}>
                Ver Todas as Vendas
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhaConta;
