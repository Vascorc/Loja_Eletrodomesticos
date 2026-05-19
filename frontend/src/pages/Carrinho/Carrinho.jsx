import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Carrinho.css';

const CartTimer = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState(expiresAt - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(expiresAt - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    if (timeLeft <= 0) return <span className="timer expired">Expirado</span>;

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return (
        <span className={`timer ${minutes < 1 ? 'warning' : ''}`}>
            Reservado por: {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
    );
};

const Carrinho = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    if (cart.length === 0) {
        return (
            <>
                <div className="carrinho-overlay" onClick={() => setIsCartOpen(false)}></div>
                <div className="carrinho-drawer">
                    <div className="drawer-header">
                        <h2>O seu carrinho está vazio</h2>
                        <button className="btn-close" onClick={() => setIsCartOpen(false)}>&times;</button>
                    </div>
                    <div className="carrinho-vazio">
                        <button onClick={() => { setIsCartOpen(false); navigate('/catalogo'); }} className="btn-primary">Ver Produtos</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="carrinho-overlay" onClick={() => setIsCartOpen(false)}></div>
            <div className="carrinho-drawer">
                <div className="drawer-header">
                    <h2>Carrinho de Compras</h2>
                    <button className="btn-close" onClick={() => setIsCartOpen(false)}>&times;</button>
                </div>
                <div className="carrinho-items">
                {cart.map(item => (
                    <div className="carrinho-item" key={item.produtoId}>
                        <div className="item-info">
                            <h3>{item.nome}</h3>
                            <p className="preco">{item.preco.toFixed(2)} €</p>
                            {item.expiresAt && <CartTimer expiresAt={item.expiresAt} />}
                        </div>
                        <div className="item-actions">
                            <input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.quantidade}
                                onChange={(e) => updateQuantity(item.produtoId, parseInt(e.target.value))}
                                className="qtd-input"
                            />
                            <button onClick={() => removeFromCart(item.produtoId)} className="btn-remove">Remover</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carrinho-resumo">
                <h3>Total: {cartTotal.toFixed(2)} €</h3>
                <div className="resumo-actions">
                    <button onClick={clearCart} className="btn-limpar">Limpar Carrinho</button>
                    <button onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} className="btn-checkout">Avançar para Checkout</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Carrinho;
