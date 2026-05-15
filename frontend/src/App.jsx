import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/minha-conta" element={
            <ProtectedRoute>
              <MinhaConta />
            </ProtectedRoute>
          } />
          <Route path="/produtos" element={
            <ProtectedRoute>
              <Produtos />
            </ProtectedRoute>
          } />
          <Route path="/carrinho" element={
            <ProtectedRoute>
              <Carrinho />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/fatura" element={
            <ProtectedRoute>
              <Fatura />
            </ProtectedRoute>
          } />
          {/* Redirecionar qualquer outra rota para a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
