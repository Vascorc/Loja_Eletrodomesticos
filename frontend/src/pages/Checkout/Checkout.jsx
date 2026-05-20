import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [metodoPagamento, setMetodoPagamento] = useState('Pagamento na entrega');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const requestPayload = {
            itens: cart.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade
            })),
            metodoPagamento
        };

        try {
            const res = await fetch('http://localhost:8080/api/vendas/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
                },
                body: JSON.stringify(requestPayload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Erro ao processar a compra');
            }

            const data = await res.json();
            clearCart();
            // Pass invoice ID to the Fatura view via state
            navigate('/fatura', { state: { faturaId: data.id } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="checkout-vazio">
                    <h2>O seu carrinho está vazio</h2>
                    <p>Adicione artigos ao carrinho no catálogo para poder finalizar a compra.</p>
                    <button onClick={() => navigate('/catalogo')} className="btn-confirmar" style={{ maxWidth: '280px', margin: '2rem auto 0', display: 'block' }}>
                        Ir para o Catálogo
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <h2>Finalizar Compra</h2>
                <div className="checkout-content">
                    <div className="resumo-pedido">
                        <h3>Resumo do Pedido</h3>
                        {cart.map(item => (
                            <div key={item.produtoId} className="resumo-item">
                                <span>{item.quantidade}x {item.nome}</span>
                                <span>{(item.preco * item.quantidade).toFixed(2)} €</span>
                            </div>
                        ))}
                        <div className="resumo-total">
                            <strong>Total a Pagar:</strong>
                            <strong>{cartTotal.toFixed(2)} €</strong>
                        </div>
                    </div>

                    <form onSubmit={handleCheckout} className="checkout-form">
                        <h3>Dados de Pagamento</h3>
                        <div className="form-group">
                            <label>Método de Pagamento</label>
                            <select 
                                value={metodoPagamento} 
                                onChange={(e) => setMetodoPagamento(e.target.value)}
                                required
                            >
                                <option value="Pagamento na entrega">Pagamento no momento da entrega</option>
                                <option value="Multibanco" disabled>Multibanco (Indisponível)</option>
                                <option value="MBWay" disabled>MBWay (Indisponível)</option>
                            </select>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-confirmar" disabled={loading}>
                            {loading ? 'A Processar...' : 'Confirmar Encomenda'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Checkout;
