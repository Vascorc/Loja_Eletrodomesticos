import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import CatalogoPage from './pages/Catalogo/CatalogoPage';
import AdminProdutos from './pages/AdminProdutos/AdminProdutos';
import MinhaConta from './pages/MinhaConta/MinhaConta';
import Produtos from './pages/Produtos/Produtos';
import Carrinho from './pages/Carrinho/Carrinho';
import Checkout from './pages/Checkout/Checkout';
import Fatura from './pages/Fatura/Fatura';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Carrinho />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Protegidas para qualquer utilizador autenticado */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalogo"
            element={
              <ProtectedRoute>
                <CatalogoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minha-conta"
            element={
              <ProtectedRoute>
                <MinhaConta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <ProtectedRoute>
                <Produtos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fatura"
            element={
              <ProtectedRoute>
                <Fatura />
              </ProtectedRoute>
            }
          />

          {/* Rota Protegida apenas para ADMIN */}
          <Route
            path="/admin/produtos"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminProdutos />
              </ProtectedRoute>
            }
          />

          {/* Raiz redireciona para o dashboard (ProtectedRoute redireciona para login se não estiver autenticado) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
