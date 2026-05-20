import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService } from '../../services/produtoService';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const CATEGORIAS_FIXAS = [
  { id: 1, nome: 'Grandes Eletrodomésticos' },
  { id: 2, nome: 'Televisores' },
  { id: 3, nome: 'Informática' },
  { id: 4, nome: 'Pequenos Eletrodomésticos' },
  { id: 5, nome: 'Promoções do Dia' },
];

const Navbar = () => {
  const user = AuthService.getCurrentUser();
  const { cart, cartTotal, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    produtoService.listarTodos()
      .then(setProdutos)
      .catch(() => {});

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

  if (!user) return null;

  return (
    <nav className="dashboard-nav">
      <div className="nav-top">
        <div className="nav-logo" onClick={() => navigate('/dashboard')}>
          ELECTRO-SD
        </div>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

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

        <div className={`nav-actions ${menuOpen ? 'nav-actions-open' : ''}`}>
          <Link to="/minha-conta" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMenuOpen(false)}>
            <span className="nav-item-label">Olá, {user.email.split('@')[0]}</span>
            <span>Minha Conta</span>
          </Link>
          <Link to="/entregas" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMenuOpen(false)}>
            <span>Acompanhar</span>
            <span>Entregas</span>
          </Link>
          <div onClick={() => { setIsCartOpen(true); setMenuOpen(false); }} className="nav-item" style={{ cursor: 'pointer' }}>
            <span>🛒 Carrinho</span>
            <span>{cart.length} itens ({cartTotal.toFixed(2)} €)</span>
          </div>
          <span onClick={handleLogout} className="logout-link">Sair</span>
        </div>
      </div>

      <div className={`nav-bottom ${menuOpen ? 'nav-bottom-open' : ''}`}>
        <span onClick={() => { navigate('/catalogo'); setMenuOpen(false); }} style={{ cursor: 'pointer' }}>Todas as Categorias</span>
        {CATEGORIAS_FIXAS.map(cat => (
          <span
            key={cat.id}
            onClick={() => { navigate(`/catalogo?cat=${cat.id}`); setMenuOpen(false); }}
            style={{ cursor: 'pointer' }}
          >
            {cat.nome}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
