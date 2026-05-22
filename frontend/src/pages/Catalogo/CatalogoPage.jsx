import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useCart } from '../../context/CartContext';
import { produtoService, categoriaService } from '../../services/produtoService';
import Navbar from '../../components/Navbar/Navbar';
import './Catalogo.css';

const EFICIENCIA_COR = {
  'A+++': '#047857', 'A++': '#059669', 'A+': '#10B981',
  'A': '#34D399', 'B': '#FBBF24', 'C': '#F59E0B', 'D': '#EF4444',
};


const removerAcentos = (str) => {
  return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
};

const CatalogoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat');
  const destaqueParam = searchParams.get('destaque') === 'true';

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pesquisa, setPesquisa] = useState(queryParam);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoryParam ? parseInt(categoryParam) : null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [user, setUser] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
    const carregarProdutos = destaqueParam
      ? produtoService.maisVendidos()
      : produtoService.listarTodos();

    Promise.all([carregarProdutos, categoriaService.listarTodas()])
      .then(([prods, cats]) => {
        setProdutos(prods);
        setCategorias(cats);
      })
      .catch(() => setErro('Erro ao carregar o catálogo. Verifique se o servidor está ativo.'))
      .finally(() => setLoading(false));
  }, [destaqueParam]);

  useEffect(() => {
    setPesquisa(queryParam);
    setCategoriaAtiva(categoryParam ? parseInt(categoryParam) : null);
  }, [queryParam, categoryParam]);

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = pesquisa === '' || removerAcentos(p.nome).includes(removerAcentos(pesquisa));
    const matchCat = categoriaAtiva === null || p.categoriaId === categoriaAtiva;
    return matchNome && matchCat;
  });

  const handleAddCarrinho = (produto) => {
    addToCart(produto);
    setAddedId(produto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleCategoriaChange = (id) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('destaque');
    if (id === null) {
      newParams.delete('cat');
    } else {
      newParams.set('cat', id.toString());
    }
    setSearchParams(newParams);
  };

  const handleDestaqueClick = () => {
    const newParams = new URLSearchParams();
    newParams.set('destaque', 'true');
    setSearchParams(newParams);
  };

  return (
    <div className="catalogo-page">
      {user && <Navbar />}
      <main className="catalogo-main">

        <div className="catalogo-header">
          <h1>Catálogo de Produtos</h1>
          <p className="catalogo-subtitulo">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
          </p>
          <div className="search-bar">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
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
            className={`cat-pill ${!destaqueParam && categoriaAtiva === null ? 'active' : ''}`}
            onClick={() => handleCategoriaChange(null)}
          >
            Todos
          </button>
          <button
            className={`cat-pill cat-pill-destaque ${destaqueParam ? 'active' : ''}`}
            onClick={handleDestaqueClick}
          >
            ⭐ Em Destaque
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`cat-pill ${!destaqueParam && categoriaAtiva === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoriaChange(cat.id)}
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
                  {produto.stock === 0 ? 'Esgotado' : produto.stock <= 5 ? 'Poucas unidades' : 'Em stock'}
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
