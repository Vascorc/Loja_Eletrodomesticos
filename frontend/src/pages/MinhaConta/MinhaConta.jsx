import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './MinhaConta.css';

const MinhaConta = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  if (!user) return <div className="loading">A carregar...</div>;

  // Verifica se o user tem permissões para gerir produtos (ex: ADMIN)
  // Ajusta o "ADMIN" conforme o que tens configurado no backend
  const canManageProducts = user.perfil === 'ADMIN' || user.perfil === 'GESTOR';

  return (
    <div className="minhaconta-page">
      <nav className="dashboard-nav">
        <div className="nav-top">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>ELECTRO-SD</Link>
          
          <div className="nav-actions">
            <Link to="/" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
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

          <div className="account-card">
            <h3>Minhas Encomendas</h3>
            <p>Ainda não tens encomendas registadas.</p>
          </div>

          {canManageProducts && (
            <div className="account-card admin-card">
              <h3>Administração</h3>
              <p>Tens permissões de gestão.</p>
              <button className="admin-btn" onClick={() => navigate('/admin/produtos')}>Adicionar Produtos</button>
              <button className="admin-btn" onClick={() => navigate('/admin/produtos')}>Gerir Produtos</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhaConta;
