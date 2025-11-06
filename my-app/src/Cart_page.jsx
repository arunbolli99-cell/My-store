import { useCart } from './CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h1 id="heading2">Your Cart is Empty</h1>
                <p>Add some products to your cart to see them here.</p>
                <Link to="/categories">
                    <button className="continue-shopping-btn">Continue Shopping</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 id="heading2">Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.title} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.title}</h3>
                                <p className="cart-item-category">{item.category}</p>
                                <p className="cart-item-price">₹ {item.price}</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="item-total">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="remove-btn"
                                >
                                    <i className="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹ {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹ {getCartTotal().toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate('/delivery-address')}>Proceed to Checkout</button>
                    <button onClick={clearCart} className="clear-cart-btn">Clear Cart</button>
                    <Link to="/categories">
                        <button className="continue-shopping-btn">Continue Shopping</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CartPage;