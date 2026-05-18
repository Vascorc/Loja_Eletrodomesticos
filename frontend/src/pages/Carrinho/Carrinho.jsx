import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Carrinho.css';

const Carrinho = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="carrinho-vazio">
                <h2>O seu carrinho está vazio</h2>
                <button onClick={() => navigate('/produtos')} className="btn-primary">Ver Produtos</button>
            </div>
        );
    }

    return (
        <div className="carrinho-container">
            <h2>Carrinho de Compras</h2>
            <div className="carrinho-items">
                {cart.map(item => (
                    <div className="carrinho-item" key={item.produtoId}>
                        <div className="item-info">
                            <h3>{item.nome}</h3>
                            <p className="preco">{item.preco.toFixed(2)} €</p>
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
                    <button onClick={() => navigate('/checkout')} className="btn-checkout">Avançar para Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default Carrinho;
