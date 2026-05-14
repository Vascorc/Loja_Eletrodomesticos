import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem!');
      return;
    }

    setLoading(true);

    try {
      await AuthService.register(formData.nome, formData.email, formData.password);
      setSuccess('Conta criada com sucesso! A redirecionar para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao criar a conta.');
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
    <div className="register-page" onMouseMove={handleMouseMove}>
      <div className="register-container">
        <div className="register-header">
          <h2>Criar Conta</h2>
          <p>Junte-se à nossa Loja de Eletrodomésticos</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          {success && <div className="success-message" style={{color: '#4dff4d', marginBottom: '1rem', textAlign: 'center'}}>{success}</div>}
          
          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: João Silva"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
              minLength="8"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Palavra-passe</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repita a palavra-passe"
              minLength="8"
              disabled={loading}
            />
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'A registar...' : 'Criar Conta'}
          </button>
        </form>

        <div className="register-footer">
          <p>Já tem conta? <Link to="/login">Entrar aqui</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
