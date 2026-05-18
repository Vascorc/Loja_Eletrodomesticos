import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService } from '../../services/produtoService';
import { useCart } from '../../context/CartContext';
import './ProdutoDetalhes.css';
import '../Dashboard/Dashboard.css';

const ProdutoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, cartTotal } = useCart();

  const [user, setUser] = useState(null);
  const [produto, setProduto] = useState(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser(AuthService.getCurrentUser());

    const carregarDetalhes = async () => {
      setLoading(true);
      setError(null);
      try {
        const prod = await produtoService.buscarPorId(id);
        setProduto(prod);

        // Fetch related products (same category)
        if (prod.categoriaId) {
          const relacionados = await produtoService.listarPorCategoria(prod.categoriaId);
          // Remove current product from related list and limit to 4
          setProdutosRelacionados(relacionados.filter(p => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto:", err);
        setError("Não foi possível carregar os detalhes do produto.");
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [id]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
    window.location.reload();
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(navSearchTerm)}`);
    }
  };

  if (loading) return <div className="loading" style={{textAlign: 'center', padding: '3rem'}}>A carregar detalhes...</div>;
  if (error || !produto) return <div className="error-message" style={{color: 'red', textAlign: 'center', padding: '3rem'}}>{error || "Produto não encontrado."}</div>;

  return (
    <>
      {user && (
        <nav className="dashboard-nav">
          <div className="nav-top">
            <div className="nav-logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>ELECTRO-SD</div>
            
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
              <div onClick={() => navigate('/carrinho')} className="nav-item" style={{cursor: 'pointer'}}>
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
      )}

      <div className="produto-detalhes-page">
        <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Voltar
        </button>
      </div>

      <div className="produto-principal">
        <div className="produto-imagem-container">
          {produto.imagemUrl ? (
            <img src={produto.imagemUrl} alt={produto.nome} className="produto-imagem-grande" />
          ) : (
            <div className="imagem-placeholder-grande">[SEM IMAGEM]</div>
          )}
        </div>
        
        <div className="produto-info-completa">
          <h1 className="produto-titulo">{produto.nome}</h1>
          {produto.categoriaNome && (
            <span className="produto-categoria-badge">{produto.categoriaNome}</span>
          )}
          
          <div className="produto-preco-destaque">{produto.preco}€</div>
          
          <div className="produto-especificacoes">
            <h3>Especificações</h3>
            <ul>
              <li><strong>Stock Disponível:</strong> {produto.stock} unidades</li>
              {produto.eficienciaEnergetica && (
                <li>
                  <strong>Eficiência Energética:</strong> 
                  <span className={`badge-energia classe-${produto.eficienciaEnergetica.toLowerCase()}`}>
                    {produto.eficienciaEnergetica}
                  </span>
                </li>
              )}
              {/* Informações extra fictícias para compor o design */}
              <li><strong>Garantia:</strong> 3 Anos (Fabricante)</li>
              <li><strong>Entrega:</strong> Gratuita em Portugal Continental</li>
            </ul>
          </div>

          <button 
            className="btn-adicionar-carrinho-grande" 
            onClick={() => {
              addToCart(produto);
              alert("Adicionado ao carrinho com sucesso!");
            }}
            disabled={produto.stock <= 0}
          >
            {produto.stock > 0 ? '🛒 Adicionar ao Carrinho' : 'Esgotado'}
          </button>
        </div>
      </div>

      {produtosRelacionados.length > 0 && (
        <div className="produtos-relacionados-section">
          <h2>Produtos Relacionados</h2>
          <div className="products-grid">
            {produtosRelacionados.map(rel => (
              <div 
                key={rel.id} 
                className="product-card" 
                onClick={() => navigate(`/produto/${rel.id}`)}
                style={{cursor: 'pointer'}}
              >
                <div className="product-image-placeholder" style={{padding: rel.imagemUrl ? '0' : '40px 0', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {rel.imagemUrl ? (
                    <img src={rel.imagemUrl} alt={rel.nome} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0'}} />
                  ) : (
                    '[IMAGEM]'
                  )}
                </div>
                <div className="product-info">
                  <h3>{rel.nome}</h3>
                  <div className="product-price">{rel.preco}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ProdutoDetalhes;
