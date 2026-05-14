import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.login(email, password);
      navigate('/'); // Redirecionar para a home após login
      window.location.reload(); // Recarregar para atualizar o estado global se necessário
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    currentTarget.style.setProperty('--mouse-x', `${x}px`);
    currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="login-page" onMouseMove={handleMouseMove}>
      <div className="login-container">
        <div className="login-header">
          <h2>Bem-vindo de volta</h2>
          <p>Aceda à sua conta na Loja de Eletrodomésticos</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemplo@email.com"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" disabled={loading} />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className="forgot-password">Esqueceu a palavra-passe?</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem conta? <Link to="/register">Registe-se aqui</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
