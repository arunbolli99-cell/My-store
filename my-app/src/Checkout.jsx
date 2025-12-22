
import { useState } from 'react';
import { useCart } from './CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import apiService from './apiService';

function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [addressDetails, setAddressDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });
    const [selectedPayment, setSelectedPayment] = useState('');

    // Your merchant details
    const merchantDetails = {
        upiId: 'arunbolli99-1@oksbi',
        merchantName: 'My Store',
        accountNumber: '44453931403',
        ifscCode: 'XXXX0000XXX'
    };

    const handleInputChange = (e) => {
        setAddressDetails({
            ...addressDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const sendOrderEmail = async (userEmail, orderData) => {
        try {
            await fetch("https://my-store-backend-h6ho.onrender.com/send-mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    subject: "Order Confirmation",
                    orderDetails: orderData
                })
            });
        } catch (error) {
            console.error("Error sending order confirmation email:", error);
        }
    };

    const handlePaymentSubmit = async () => {
        try {
            const paymentMethodMap = {
                'upi': 'UPI',
                'card': 'Card',
                'cod': 'COD',
                'netbanking': 'Card'
            };

            const address = {
                street: addressDetails.street,
                city: addressDetails.city,
                pincode: addressDetails.pincode,
                state: addressDetails.state,
                country: addressDetails.country
            };

            const paymentMethod = paymentMethodMap[selectedPayment] || 'COD';

            const response = await apiService.placeOrder(address, paymentMethod);

            const orderDetails = {
                orderId: response.orderId || 'ORD' + Date.now(),
                items: cartItems,
                totalAmount: getCartTotal(),
                address: addressDetails,
                paymentMethod: selectedPayment,
                date: new Date().toISOString()
            };

            await sendOrderEmail(addressDetails.email, orderDetails);

            alert(`Order placed successfully! Order ID: ${orderDetails.orderId}`);
            await clearCart();
            navigate('/orders');
        } catch (error) {
            console.error("Error placing order:", error);
            alert(error.message || "Error placing order. Please try again.");
        }
    };

    // Generate UPI payment link
    const generateUPILink = () => {
        const amount = getCartTotal().toFixed(2);
        return `upi://pay?pa=${merchantDetails.upiId}&pn=${merchantDetails.merchantName}&am=${amount}&cu=INR`;
    };

    if (step === 1) {
        return (
            <div className="checkout-page">
                <form onSubmit={handleAddressSubmit} className="address-form">

                     <h1 id="deliver-page-heading">Delivery Address</h1>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={addressDetails.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={addressDetails.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={addressDetails.phone}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address *</label>
                        <textarea
                            name="street"
                            value={addressDetails.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input 
                                id="city-input"
                                type="text"
                                name="city"
                                value={addressDetails.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input
                                id="state-input"
                                type="text"
                                name="state"
                                value={addressDetails.state}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Pincode *</label>
                            <input
                                id="pincode-input"
                                type="text"
                                name="pincode"
                                value={addressDetails.pincode}
                                onChange={handleInputChange}
                                pattern="[0-9]{6}"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Continue to Payment</button>
                </form>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 id="payment-heading">Payment Methods</h1>
            <div className="payment-container">
                <div className="payment-methods">
                    <div className="merchant-info">
                        <h3>Payment will be received by:</h3>
                        <p><strong>Merchant:</strong> {merchantDetails.merchantName}</p>
                        <p><strong>UPI ID:</strong> {merchantDetails.upiId}</p>
                    </div>

                    <div className="payment-option">
                        <input
                            type="radio"
                            id="upi"
                            name="payment"
                            value="upi"
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label htmlFor="upi">
                            <i className="bi bi-phone"></i> UPI Payment
                        </label>
                    </div>
                    {selectedPayment === 'upi' && (
                        <div className="upi-details">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateUPILink())}`} 
                                className="qr-code" 
                                alt="UPI QR Code" 
                            />
                            <p>Scan QR code with any UPI app</p>
                            <p className="upi-id">Pay to: {merchantDetails.upiId}</p>
                            <p className="amount">Amount: ₹ {getCartTotal().toFixed(2)}</p>
                            <input 
                                type="text" 
                                placeholder="Enter Transaction ID after payment" 
                                className="upi-input" 
                            />
                        </div>
                    )}

                    <div className="payment-option">
                        <input
                            type="radio"
                            id="card"
                            name="payment"
                            value="card"
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label htmlFor="card">
                            <i className="bi bi-credit-card"></i> Credit/Debit Card
                        </label>
                    </div>
                    {selectedPayment === 'card' && (
                        <div className="card-details">
                            <p className="payment-note">Card payments will be processed through secure payment gateway</p>
                            <input type="text" placeholder="Card Number" className="card-input" maxLength="16" />
                            <div className="card-row">
                                <input type="text" placeholder="MM/YY" className="card-input" maxLength="5" />
                                <input type="text" placeholder="CVV" className="card-input" maxLength="3" />
                            </div>
                            <input type="text" placeholder="Cardholder Name" className="card-input" />
                        </div>
                    )}

                    <div className="payment-option">
                        <input
                            type="radio"
                            id="netbanking"
                            name="payment"
                            value="netbanking"
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label htmlFor="netbanking">
                            <i className="bi bi-bank"></i> Net Banking
                        </label>
                    </div>
                    {selectedPayment === 'netbanking' && (
                        <div className="netbanking-details">
                            <p className="payment-note">You will be redirected to your bank's website</p>
                            <select className="bank-select">
                                <option value="">Select Bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="pnb">Punjab National Bank</option>
                            </select>
                        </div>
                    )}

                    <div className="payment-option">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <label htmlFor="cod">
                            <i className="bi bi-cash"></i> Cash on Delivery
                        </label>
                    </div>
                    {selectedPayment === 'cod' && (
                        <div className="cod-details">
                            <p className="payment-note">Pay cash when your order is delivered</p>
                            <p className="cod-charges">COD charges may apply: ₹ 40</p>
                        </div>
                    )}
                </div>

                <div className="order-summary-payment">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.title} x {item.quantity}</span>
                                <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>₹ {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery:</span>
                        <span>Free</span>
                    </div>
                    {selectedPayment === 'cod' && (
                        <div className="summary-row">
                            <span>COD Charges:</span>
                            <span>₹ 40.00</span>
                        </div>
                    )}
                    <div className="summary-row total">
                        <span>Total Amount:</span>
                        <span>₹ {(getCartTotal() + (selectedPayment === 'cod' ? 40 : 0)).toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handlePaymentSubmit} 
                        className="place-order-btn"
                        disabled={!selectedPayment}
                    >
                        {selectedPayment === 'cod' ? 'Place Order' : 'Pay Now'}
                    </button>
                    <button onClick={() => setStep(1)} className="back-btn">
                        Back to Address
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
