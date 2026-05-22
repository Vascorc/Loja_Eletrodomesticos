import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService } from '../../services/produtoService';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    const vistos = JSON.parse(localStorage.getItem('vistosRecentemente') || '[]');
    setRecentes(vistos);

    const carregarProdutos = async () => {
      try {
        const dados = await produtoService.maisVendidos();
        setProdutos(dados);
      } catch (error) {
        console.error("Erro ao carregar produtos em destaque:", error);
      }
    };
    carregarProdutos();
  }, []);

  const registarVisualizacao = (product) => {
    let vistos = JSON.parse(localStorage.getItem('vistosRecentemente') || '[]');
    vistos = vistos.filter(p => p.id !== product.id);
    vistos.unshift(product);
    if (vistos.length > 4) vistos = vistos.slice(0, 4);
    localStorage.setItem('vistosRecentemente', JSON.stringify(vistos));
    setRecentes(vistos);
    navigate(`/produto/${product.id}`);
  };

  if (!user) return <div className="loading">A carregar...</div>;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        <section className="hero-banner">
          <h1>Bem-vindo à ELECTRO-SD</h1>
          <p>Os melhores eletrodomésticos com as melhores tecnologias de Sistemas Distribuídos.</p>
          <Link to="/catalogo" className="btn-ver-todos-hero">Ver Todos os Produtos</Link>
        </section>

        <div className="section-title">
          <h2>Produtos em Destaque</h2>
          <Link to="/catalogo?destaque=true" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Ver todos</Link>
        </div>

        <div className="products-grid">
          {produtos.length > 0 ? (
            produtos.map(product => (
              <div key={product.id} className="product-card" onClick={() => registarVisualizacao(product)} style={{ cursor: 'pointer' }}>
                <div className="product-image-placeholder" style={{ padding: product.imagemUrl ? '0' : '40px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.imagemUrl ? (
                    <img src={product.imagemUrl} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                  ) : '[IMAGEM]'}
                </div>
                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <div className="product-price">{product.preco}€</div>
                  <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
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
              <div key={`recent-${product.id}`} className="product-card" onClick={() => registarVisualizacao(product)} style={{ cursor: 'pointer' }}>
                <div className="product-image-placeholder" style={{ padding: product.imagemUrl ? '0' : '40px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.imagemUrl ? (
                    <img src={product.imagemUrl} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                  ) : '[IMAGEM]'}
                </div>
                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <div className="product-price">{product.preco}€</div>
                  <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b' }}>Ainda não viste nenhum produto. Clica em algum produto do catálogo para ele aparecer aqui!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
