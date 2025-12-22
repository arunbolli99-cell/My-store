import { useCart } from './CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'WELCOME10') {
            setDiscountPercentage(10);
            setCouponMessage('✓ Coupon applied! You got 10% discount');
        } else if (couponCode.trim() === '') {
            setCouponMessage('Please enter a coupon code');
        } else {
            setDiscountPercentage(0);
            setCouponMessage('Invalid coupon code');
        }
    };

    const subtotal = getCartTotal();
    const discountAmount = (subtotal * discountPercentage) / 100;
    const finalTotal = subtotal - discountAmount;

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/sign-in");
        }
    }, [navigate]);

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h1 id="heading2">Your Cart is Empty</h1>
                <p>Add some products to your cart to see them here.</p>
                <Link to="/">
                    <button className="continue-shopping-btn">Continue Shopping</button>
                </Link>
            </div>
        );
    }

const handleCheckout = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("You must log in first!");
        navigate("/sign-in");
        return;
    }

    navigate("/delivery-address");
};


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
                    
                    <div className="coupon-section">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="coupon-input"
                        />
                        <button onClick={applyCoupon} className="apply-coupon-btn">Apply</button>
                        {couponMessage && <p className="coupon-message">{couponMessage}</p>}
                    </div>

                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹ {subtotal.toFixed(2)}</span>
                    </div>
                    {discountPercentage > 0 && (
                        <div className="summary-row discount">
                            <span>Discount ({discountPercentage}%):</span>
                            <span>-₹ {discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹ {finalTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>


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