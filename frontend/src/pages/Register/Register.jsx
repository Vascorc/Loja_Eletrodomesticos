import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As passwords não coincidem!');
      return;
    }

    console.log('Registo submetido com:', formData);
    // TODO: Enviar para o backend (onde o perfil será definido como "CLIENTE" por defeito)
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
          
          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: João Silva"
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
            />
          </div>

          <button type="submit" className="register-button">
            Criar Conta
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
