import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService } from '../../services/produtoService';
import { useCart } from '../../context/CartContext';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const { cart, addToCart, cartTotal, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const searchRef = useRef(null);

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

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSugestoes(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavSearchChange = (e) => {
    const valor = e.target.value;
    setNavSearchTerm(valor);
    if (valor.trim().length >= 2) {
      const filtrados = produtos
        .filter(p => (p.nome || '').toLowerCase().includes(valor.toLowerCase()))
        .slice(0, 6);
      setSugestoes(filtrados);
      setShowSugestoes(filtrados.length > 0);
    } else {
      setSugestoes([]);
      setShowSugestoes(false);
    }
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    setShowSugestoes(false);
    if (navSearchTerm.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(navSearchTerm)}`);
    }
  };

  const handleSugestaoClick = (produto) => {
    setNavSearchTerm(produto.nome);
    setShowSugestoes(false);
    navigate(`/produto/${produto.id}`);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

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
      <nav className="dashboard-nav">
        <div className="nav-top">
          <div className="nav-logo">ELECTRO-SD</div>

          <form className="nav-search" onSubmit={handleNavSearch} ref={searchRef} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Pesquisar eletrodomésticos, tecnologia..."
              value={navSearchTerm}
              onChange={handleNavSearchChange}
              onFocus={() => sugestoes.length > 0 && setShowSugestoes(true)}
              autoComplete="off"
            />
            <button type="submit" className="search-btn">🔍</button>

            {showSugestoes && (
              <ul className="autocomplete-dropdown">
                {sugestoes.map(p => (
                  <li key={p.id} className="autocomplete-item" onMouseDown={() => handleSugestaoClick(p)}>
                    {p.imagemUrl && <img src={p.imagemUrl} alt={p.nome} className="autocomplete-img" />}
                    <div className="autocomplete-info">
                      <span className="autocomplete-nome">{p.nome}</span>
                      <span className="autocomplete-cat">{p.categoriaNome}</span>
                    </div>
                    <span className="autocomplete-preco">
                      {p.preco?.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </li>
                ))}
                <li className="autocomplete-ver-todos" onMouseDown={handleNavSearch}>
                  🔍 Ver todos os resultados para "<strong>{navSearchTerm}</strong>"
                </li>
              </ul>
            )}
          </form>

          <div className="nav-actions">
            <Link to="/minha-conta" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>Olá, {user.email.split('@')[0]}</span>
              <span>Minha Conta</span>
            </Link>
            <div className="nav-item">
              <span>Encomendas</span>
              <span>& Devoluções</span>
            </div>
            <div onClick={() => setIsCartOpen(true)} className="nav-item" style={{ cursor: 'pointer' }}>
              <span>🛒 Carrinho</span>
              <span>{cart.length} itens ({cartTotal.toFixed(2)} €)</span>
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
          <Link to="/catalogo" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>Ver todos</Link>
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
