import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { produtoService, categoriaService } from '../../services/produtoService';
import { useCart } from '../../context/CartContext';
import './Navbar.css';


const removerAcentos = (str) => {
  return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
};

const Navbar = () => {
  const user = AuthService.getCurrentUser();
  const { cart, cartTotal, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    produtoService.listarTodos().then(setProdutos).catch(() => {});
    categoriaService.listarTodas().then(setCategorias).catch(() => {});

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
        .filter(p => removerAcentos(p.nome).includes(removerAcentos(valor)))
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
          <button type="submit" className="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Ver todos os resultados para "<strong>{navSearchTerm}</strong>"
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
        <button className="nav-cat-item nav-cat-all" onClick={() => { navigate('/catalogo'); setMenuOpen(false); }}>
          Todos os Produtos
        </button>
        <button className="nav-cat-item nav-cat-destaque" onClick={() => { navigate('/catalogo?destaque=true'); setMenuOpen(false); }}>
          Em Destaque
        </button>
        <span className="nav-cat-divider" />
        {categorias.map(cat => (
          <button
            key={cat.id}
            className="nav-cat-item"
            onClick={() => { navigate(`/catalogo?cat=${cat.id}`); setMenuOpen(false); }}
          >
            {cat.nome}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
