import { createContext, useContext, useState, useEffect } from 'react';
import apiService from './apiService';

const CartContext = createContext();

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            loadCartFromBackend();
        } else {
            setCartItems([]);
        }
    }, []);

    const loadCartFromBackend = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        setIsLoading(true);
        try {
            const data = await apiService.getCart();
            const cartData = data.cart || {};
            const items = cartData.items || [];
            
            const convertedItems = items.map(item => ({
                id: item.productId,
                quantity: item.quantity,
                price: item.price,
                title: item.title,
                image: item.image,
                category: item.category
            }));
            
            setCartItems(convertedItems);
        } catch (error) {
            console.error("Error loading cart from backend:", error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return false;
        }

        try {
            await apiService.addToCart(product.id, 1, product.price);
            
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === product.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity: 1 }];
                }
            });
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            await apiService.removeFromCart(productId);
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Error removing from cart:", error);
            await loadCartFromBackend();
        }
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            await apiService.clearCart();
            setCartItems([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loadCartFromBackend,
        isLoading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}