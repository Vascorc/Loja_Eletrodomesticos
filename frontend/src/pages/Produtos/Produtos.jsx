import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import './Produtos.css';

const Produtos = () => {
    const [produtos, setProdutos] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('http://localhost:8080/api/produtos', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => setProdutos(data))
        .catch(err => console.error("Erro ao carregar produtos", err));
    }, []);

    return (
        <div className="produtos-container">
            <h2>Catálogo de Produtos</h2>
            <div className="produtos-grid">
                {produtos.map(produto => (
                    <div className="produto-card" key={produto.id}>
                        <div className="produto-info">
                            <h3>{produto.nome}</h3>
                            <p className="categoria">{produto.categoriaNome}</p>
                            <p className="preco">{produto.preco.toFixed(2)} €</p>
                            <p className="stock">Stock: {produto.stock}</p>
                        </div>
                        <button 
                            className="btn-add-cart" 
                            disabled={produto.stock === 0}
                            onClick={() => addToCart(produto)}
                        >
                            {produto.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Produtos;
