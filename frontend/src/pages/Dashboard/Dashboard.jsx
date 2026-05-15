import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Dashboard.css';

const Dashboard = () => {
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

  const featuredProducts = [
    { id: 1, name: "Frigorífico Combinado Samsung No Frost", price: "749.99", category: "Frio" },
    { id: 2, name: "Máquina de Lavar Roupa LG 9kg AI DD", price: "499.90", category: "Lavagem" },
    { id: 3, name: "Televisão OLED Sony Bravia 55\" 4K", price: "1299.00", category: "TV" },
    { id: 4, name: "Portátil HP Victus 16-d1000", price: "899.99", category: "Informática" },
  ];

  if (!user) return <div className="loading">A carregar...</div>;

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-top">
          <div className="nav-logo">ELECTRO-SD</div>
          
          <div className="nav-search">
            <input type="text" placeholder="Pesquisar eletrodomésticos, tecnologia..." />
            <button className="search-btn">🔍</button>
          </div>

          <div className="nav-actions">
            <Link to="/minha-conta" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Olá, {user.email.split('@')[0]}</span>
              <span>Minha Conta</span>
            </Link>
            <div className="nav-item">
              <span>Encomendas</span>
              <span>& Devoluções</span>
            </div>
            <div className="nav-item">
              <span>🛒 Carrinho</span>
              <span>0 itens</span>
            </div>
            <span onClick={handleLogout} className="logout-link">Sair</span>
          </div>
        </div>

        <div className="nav-bottom">
          <span>Todas as Categorias</span>
          <span>Grandes Eletrodomésticos</span>
          <span>Televisores</span>
          <span>Informática</span>
          <span>Promoções do Dia</span>
        </div>
      </nav>

      <main className="dashboard-content">
        <section className="hero-banner">
          <h1>Bem-vindo à ELECTRO-SD</h1>
          <p>Os melhores eletrodomésticos com as melhores tecnologias de Sistemas Distribuídos.</p>
        </section>

        <div className="section-title">
          <h2>Produtos em Destaque</h2>
          <a href="#" style={{color: '#2563EB', fontWeight: '600', textDecoration: 'none'}}>Ver todos</a>
        </div>

        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-placeholder">
                [IMAGEM]
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-price">{product.price}€</div>
                <button className="add-to-cart">Adicionar ao Carrinho</button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">
          <h2>Continuar a Ver</h2>
        </div>
        <div className="products-grid">
          {/* Placeholder para mais produtos */}
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="product-card" style={{opacity: 0.7}}>
              <div className="product-image-placeholder">Em breve</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
