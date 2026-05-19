import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Cleanup timer que verifica se alguma reserva expirou (a cada 10s)
    useEffect(() => {
        const interval = setInterval(() => {
            setCart(prevCart => {
                const now = Date.now();
                const validItems = prevCart.filter(item => item.expiresAt > now);
                if (validItems.length !== prevCart.length) {
                    console.log("Uma ou mais reservas locais expiraram.");
                }
                return validItems;
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const addToCart = async (product) => {
        try {
            const token = getToken();
            if (!token) throw new Error("Precisas de ter sessão iniciada para adicionar ao carrinho.");

            const res = await fetch(`http://localhost:8080/api/carrinho/reservar/${product.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantidade: 1 })
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = "Erro desconhecido ao reservar produto";
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.error || errorMessage;
                } catch (e) {
                    // Resposta não é JSON (ex: 404, HTML de erro ou vazio)
                    errorMessage = `Erro de servidor (${res.status}): ${text || 'Sem detalhes'}`;
                }
                throw new Error(errorMessage);
            }

            setCart(prevCart => {
                const existingItem = prevCart.find(item => item.produtoId === product.id);
                const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos em ms
                
                if (existingItem) {
                    return prevCart.map(item =>
                        item.produtoId === product.id
                            ? { ...item, quantidade: item.quantidade + 1, expiresAt }
                            : { ...item, expiresAt } // Atualiza o tempo para todos os outros itens
                    );
                }
                
                // Se é novo, atualiza o tempo de todos os itens já existentes e junta o novo
                return [
                    ...prevCart.map(item => ({ ...item, expiresAt })), 
                    {
                        produtoId: product.id,
                        nome: product.nome,
                        preco: product.preco,
                        quantidade: 1,
                        stock: product.stock,
                        expiresAt
                    }
                ];
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = getToken();
            if (token) {
                await fetch(`http://localhost:8080/api/carrinho/libertar/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error("Erro ao libertar reserva", error);
        }
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

    const clearCart = async () => {
        // Libertar todos
        const token = getToken();
        for (const item of cart) {
            try {
                if (token) {
                    await fetch(`http://localhost:8080/api/carrinho/libertar/${item.produtoId}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            } catch (error) {
                console.error("Erro ao libertar reserva", error);
            }
        }
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
