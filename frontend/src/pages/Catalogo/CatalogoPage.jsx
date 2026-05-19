import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useCart } from '../../context/CartContext';
import { produtoService, categoriaService } from '../../services/produtoService';
import './Catalogo.css';

const EFICIENCIA_COR = {
  'A+++': '#047857', 'A++': '#059669', 'A+': '#10B981',
  'A': '#34D399', 'B': '#FBBF24', 'C': '#F59E0B', 'D': '#EF4444',
};


const CatalogoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pesquisa, setPesquisa] = useState(queryParam);
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [user, setUser] = useState(null);
  const { cart, cartTotal, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
    Promise.all([produtoService.listarTodos(), categoriaService.listarTodas()])
      .then(([prods, cats]) => {
        setProdutos(prods);
        setCategorias(cats);
      })
      .catch(() => setErro('Erro ao carregar o catálogo. Verifique se o servidor está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPesquisa(queryParam);
  }, [queryParam]);

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = pesquisa === '' || (p.nome || '').toLowerCase().includes(pesquisa.toLowerCase());
    const matchCat = categoriaAtiva === null || p.categoriaId === categoriaAtiva;
    return matchNome && matchCat;
  });

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      setPesquisa(navSearchTerm);
      setSearchParams({ q: navSearchTerm });
    }
  };

  const handleAddCarrinho = (produto) => {
    addToCart(produto);
    setAddedId(produto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="catalogo-page">
      {user && (
        <nav className="dashboard-nav">
          <div className="nav-top">
            <div className="nav-logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>ELECTRO-SD</div>
            
            <form className="nav-search" onSubmit={handleNavSearch}>
              <input 
                type="text" 
                placeholder="Pesquisar eletrodomésticos, tecnologia..." 
                value={navSearchTerm}
                onChange={(e) => setNavSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">🔍</button>
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
              <div onClick={() => navigate('/carrinho')} className="nav-item" style={{cursor: 'pointer'}}>
                <span>🛒 Carrinho</span>
                <span>{cart.length} itens ({cartTotal.toFixed(2)} €)</span>
              </div>
              <span onClick={handleLogout} className="logout-link" style={{cursor: 'pointer'}}>Sair</span>
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
      )}
      <main className="catalogo-main">

        <div className="catalogo-header">
          <h1>Catálogo de Produtos</h1>
          <p className="catalogo-subtitulo">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </p>
          <div className="search-bar">
            <span className="search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
            />
            {pesquisa && (
              <button className="search-clear" onClick={() => setPesquisa('')}>&#10005;</button>
            )}
          </div>
        </div>

        <div className="categorias-filtro">
          <button
            className={`cat-pill ${categoriaAtiva === null ? 'active' : ''}`}
            onClick={() => setCategoriaAtiva(null)}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill ${categoriaAtiva === cat.id ? 'active' : ''}`}
              onClick={() => setCategoriaAtiva(cat.id)}
            >
              {cat.nome}
              <span className="cat-count">{cat.totalProdutos}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="catalogo-estado">
            <div className="spinner"></div>
            <p>A carregar produtos...</p>
          </div>
        )}

        {!loading && erro && (
          <div className="catalogo-estado erro-msg">{erro}</div>
        )}

        {!loading && !erro && produtosFiltrados.length === 0 && (
          <div className="catalogo-estado">
            <p className="sem-resultados">Nenhum produto encontrado.</p>
          </div>
        )}

        {!loading && !erro && (
          <div className="produtos-grid">
            {produtosFiltrados.map(produto => (
              <div key={produto.id} className="produto-card">
                <div className="card-top">
                  <span className="card-categoria">{produto.categoriaNome}</span>
                  {produto.eficienciaEnergetica && (
                    <span
                      className="eficiencia-badge"
                      style={{ backgroundColor: EFICIENCIA_COR[produto.eficienciaEnergetica] || '#6B7280' }}
                    >
                      {produto.eficienciaEnergetica}
                    </span>
                  )}
                </div>

                {produto.imagemUrl ? (
                  <img 
                    src={produto.imagemUrl} 
                    alt={produto.nome} 
                    className="card-imagem" 
                    style={{ width: '100%', height: '150px', objectFit: 'contain', marginTop: '15px', cursor: 'pointer' }} 
                    onClick={() => navigate(`/produto/${produto.id}`)}
                  />
                ) : (
                  <div className="card-icon" onClick={() => navigate(`/produto/${produto.id}`)} style={{cursor: 'pointer'}}>&#127968;</div>
                )}

                <h3 className="card-nome">{produto.nome}</h3>

                <p className="card-preco">
                  {produto.preco?.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                </p>

                <p className={`card-stock ${produto.stock === 0 ? 'sem-stock' : produto.stock <= 5 ? 'stock-baixo' : ''}`}>
                  {produto.stock === 0
                    ? 'Sem stock'
                    : produto.stock <= 5
                    ? `Apenas ${produto.stock} em stock`
                    : `${produto.stock} em stock`}
                </p>

                <button
                  className={`btn-carrinho ${addedId === produto.id ? 'added' : ''}`}
                  disabled={produto.stock === 0}
                  onClick={() => handleAddCarrinho(produto)}
                >
                  {addedId === produto.id ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CatalogoPage;
