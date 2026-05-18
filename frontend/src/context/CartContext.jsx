import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.produtoId === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.produtoId === product.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }
            return [...prevCart, {
                produtoId: product.id,
                nome: product.nome,
                preco: product.preco,
                quantidade: 1,
                stock: product.stock
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.produtoId !== productId));
    };

    const updateQuantity = (productId, quantidade) => {
        if (quantidade < 1) return;
        setCart(prevCart => prevCart.map(item =>
            item.produtoId === productId
                ? { ...item, quantidade }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
