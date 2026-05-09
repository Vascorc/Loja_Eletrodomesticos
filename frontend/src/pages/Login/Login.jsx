import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // TODO: Connect to backend service
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Bem-vindo de volta</h2>
          <p>Aceda à sua conta na Loja de Eletrodomésticos</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Palavra-passe</label>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className="forgot-password">Esqueceu a palavra-passe?</a>
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem conta? <a href="#">Registe-se aqui</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
