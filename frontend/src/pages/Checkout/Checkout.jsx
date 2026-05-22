import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Checkout.css';

const METODOS_PAGAMENTO = [
    { value: 'Pagamento na entrega', label: 'Pagamento na entrega' },
    { value: 'Transferência bancária', label: 'Transferência bancária' },
    { value: 'Multibanco', label: 'Multibanco' },
    { value: 'MBWay', label: 'MBWay' },
];

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nomeDestinatario: '',
        telefone: '',
        morada: '',
        cidade: '',
        codigoPostal: '',
        metodoPagamento: 'Pagamento na entrega',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const requestPayload = {
            itens: cart.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade
            })),
            ...form,
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

    const envio = 0;

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <div className="checkout-breadcrumb">
                    <span onClick={() => navigate('/catalogo')}>Catálogo</span>
                    <span className="breadcrumb-sep">/</span>
                    <span onClick={() => navigate(-1)}>Carrinho</span>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-active">Finalizar Compra</span>
                </div>

                <h2 className="checkout-title">Finalizar Compra</h2>

                <div className="checkout-content">
                    <form onSubmit={handleCheckout} className="checkout-form">

                        <div className="form-section">
                            <h3 className="form-section-title">
                                <span className="form-section-num">1</span>
                                Dados de Entrega
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="nomeDestinatario">Nome completo</label>
                                    <input id="nomeDestinatario" name="nomeDestinatario" type="text" placeholder="Ex: João Silva" value={form.nomeDestinatario} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="telefone">Telemóvel</label>
                                    <input id="telefone" name="telefone" type="tel" placeholder="Ex: 912 345 678" value={form.telefone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="morada">Morada</label>
                                <input id="morada" name="morada" type="text" placeholder="Ex: Rua das Flores, nº 12, 2º Dto" value={form.morada} onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cidade">Cidade</label>
                                    <input id="cidade" name="cidade" type="text" placeholder="Ex: Lisboa" value={form.cidade} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="codigoPostal">Código Postal</label>
                                    <input id="codigoPostal" name="codigoPostal" type="text" placeholder="Ex: 1000-001" value={form.codigoPostal} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">
                                <span className="form-section-num">2</span>
                                Método de Pagamento
                            </h3>
                            <div className="metodos-pagamento">
                                {METODOS_PAGAMENTO.map(m => (
                                    <label key={m.value} className={`metodo-card ${form.metodoPagamento === m.value ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="metodoPagamento"
                                            value={m.value}
                                            checked={form.metodoPagamento === m.value}
                                            onChange={handleChange}
                                        />
                                        <span>{m.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn-confirmar" disabled={loading}>
                            {loading ? 'A processar...' : 'Confirmar Encomenda'}
                        </button>
                    </form>

                    <aside className="resumo-pedido">
                        <h3>Resumo do Pedido</h3>
                        <div className="resumo-itens">
                            {cart.map(item => (
                                <div key={item.produtoId} className="resumo-item">
                                    <div className="resumo-item-info">
                                        <span className="resumo-item-nome">{item.nome}</span>
                                        <span className="resumo-item-qty">x{item.quantidade}</span>
                                    </div>
                                    <span className="resumo-item-preco">{(item.preco * item.quantidade).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                                </div>
                            ))}
                        </div>
                        <div className="resumo-linha">
                            <span>Subtotal</span>
                            <span>{cartTotal.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="resumo-linha">
                            <span>Envio</span>
                            <span className="envio-gratis">Grátis</span>
                        </div>
                        <div className="resumo-total">
                            <strong>Total</strong>
                            <strong>{(cartTotal + envio).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</strong>
                        </div>
                        <p className="resumo-nota">Entrega gratuita em Portugal Continental. Prazo estimado: 3–5 dias úteis.</p>
                    </aside>
                </div>
            </div>
        </>
    );
};

export default Checkout;
