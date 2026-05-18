import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService } from '../../services/produtoService';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    const vistos = JSON.parse(localStorage.getItem('vistosRecentemente') || '[]');
    setRecentes(vistos);

    const carregarProdutos = async () => {
      try {
        const dados = await produtoService.listarTodos();
        setProdutos(dados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    carregarProdutos();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  const registarVisualizacao = (product) => {
    let vistos = JSON.parse(localStorage.getItem('vistosRecentemente') || '[]');
    // Remove se já existir para recolocar no início
    vistos = vistos.filter(p => p.id !== product.id);
    vistos.unshift(product);
    // Limitar a 4 produtos no histórico
    if (vistos.length > 4) vistos = vistos.slice(0, 4);
    
    localStorage.setItem('vistosRecentemente', JSON.stringify(vistos));
    setRecentes(vistos);
    
    alert(`Estás a ver detalhes de: ${product.nome}\n(Este produto foi guardado no histórico "Continuar a Ver" via localStorage)`);
  };

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
          {produtos.length > 0 ? (
            produtos.map(product => (
              <div key={product.id} className="product-card" onClick={() => registarVisualizacao(product)} style={{cursor: 'pointer'}}>
                <div className="product-image-placeholder" style={{padding: product.imagemUrl ? '0' : '40px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {product.imagemUrl ? (
                    <img src={product.imagemUrl} alt={product.nome} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0'}} />
                  ) : (
                    '[IMAGEM]'
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <div className="product-price">{product.preco}€</div>
                  <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); alert('Adicionado ao carrinho!'); }}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto disponível no catálogo no momento.</p>
          )}
        </div>

        <div className="section-title">
          <h2>Continuar a Ver</h2>
        </div>
        <div className="products-grid">
          {recentes.length > 0 ? (
            recentes.map(product => (
              <div key={`recent-${product.id}`} className="product-card" onClick={() => registarVisualizacao(product)} style={{cursor: 'pointer'}}>
                <div className="product-image-placeholder" style={{padding: product.imagemUrl ? '0' : '40px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {product.imagemUrl ? (
                    <img src={product.imagemUrl} alt={product.nome} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0'}} />
                  ) : (
                    '[IMAGEM]'
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <div className="product-price">{product.preco}€</div>
                  <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); alert('Adicionado ao carrinho!'); }}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{color: '#64748b'}}>Ainda não viste nenhum produto. Clica em algum produto do catálogo para ele aparecer aqui!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
