import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = AuthService.getCurrentUser();

  if (!user || !user.token) {
    // Redireciona para o login se não houver token/user
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.perfil)) {
      // Redireciona para o dashboard se não tiver o cargo necessário
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
