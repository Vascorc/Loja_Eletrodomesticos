import { useState, useEffect } from 'react';
import { produtoService, categoriaService } from '../../services/produtoService';
import './Catalogo.css';

const EFICIENCIA_COR = {
  'A+++': '#047857', 'A++': '#059669', 'A+': '#10B981',
  'A': '#34D399', 'B': '#FBBF24', 'C': '#F59E0B', 'D': '#EF4444',
};

function adicionarAoCarrinho(produto) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
  const item = carrinho.find(i => i.produtoId === produto.id);
  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
    });
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

const CatalogoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    Promise.all([produtoService.listarTodos(), categoriaService.listarTodas()])
      .then(([prods, cats]) => {
        setProdutos(prods);
        setCategorias(cats);
      })
      .catch(() => setErro('Erro ao carregar o catálogo. Verifique se o servidor está ativo.'))
      .finally(() => setLoading(false));
  }, []);

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = pesquisa === '' || p.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const matchCat = categoriaAtiva === null || p.categoriaId === categoriaAtiva;
    return matchNome && matchCat;
  });

  const handleAddCarrinho = (produto) => {
    adicionarAoCarrinho(produto);
    setAddedId(produto.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="catalogo-page">
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

                <div className="card-icon">&#127968;</div>

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
