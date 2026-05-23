import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [authorized, setAuthorized] = useState(null);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user || !user.token) {
      setAuthorized(false);
      return;
    }

    if (requiredRole === 'ADMIN') {
      // Faz um pedido assíncrono ao backend para verificar privilégios de administrador
      fetch('http://localhost:8080/api/vendas/historico/todos', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(res => {
          if (res.ok) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        })
        .catch(() => {
          setAuthorized(false);
        });
    } else {
      // Se não for exigido cargo de admin, basta a verificação de token normal
      setAuthorized(true);
    }
  }, [user, requiredRole]);

  if (authorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        color: '#4b5563',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderLeftColor: '#2563eb',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px auto'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          A validar credenciais com o servidor...
        </div>
      </div>
    );
  }

  if (!authorized) {
    // Redireciona para login se não tiver token, ou para a raiz se não tiver permissão
    return <Navigate to={!user || !user.token ? "/login" : "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
