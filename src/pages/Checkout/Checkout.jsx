
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    clearCartState,
    setCart,
    selectCartItems,
    selectCartTotal
} from "../../redux/slices/cartSlice";
import { useNavigate } from 'react-router-dom';
import DeliveryAddress from "../../components/DeliveryAddress/DeliveryAddress";
import apiService, { API_BASE_URL } from "../../api/apiService";
import "./Checkout.css";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

function Checkout() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const { userId, email: userEmail } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [addressDetails, setAddressDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [selectedPayment, setSelectedPayment] = useState('');
    const [paymentData, setPaymentData] = useState({
        transactionId: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        bankName: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    // Fetch cart data on mount to ensure summary is populated
    useEffect(() => {
        const fetchCart = async () => {
            if (userId) {
                try {
                    const data = await apiService.getCart();
                    let items = data.cart?.products_items || data.products_items || (Array.isArray(data) ? data : []);
                    dispatch(setCart(items));
                } catch (error) {
                    console.error("Failed to fetch cart in Checkout:", error);
                }
            }
        };

        fetchCart();
    }, [userId, dispatch]);

    const merchantDetails = {
        upiId: 'arunbolli99-1@oksbi',
        merchantName: 'My Store',
        accountNumber: '44453931403',
        ifscCode: 'XXXX0000XXX'
    };

    const handlePaymentDataChange = (e) => {
        setPaymentData({
            ...paymentData,
            [e.target.name]: e.target.value
        });
    };

    const finalizeOrder = async (backendPayload, orderSummary) => {
        try {
            const response = await fetch(`${API_BASE_URL}/placeorder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(backendPayload)
            });

            if (response.ok) {
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                existingOrders.push(orderSummary);
                localStorage.setItem('orders', JSON.stringify(existingOrders));

                alert(`Order placed successfully! Order ID: ${orderSummary.orderId}`);
                dispatch(clearCartState());
                navigate('/orders');
            } else {
                const errorText = await response.text();
                alert(`Failed to place order: ${errorText}`);
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("Error connecting to server. Please try again later.");
        }
    };

    const handlePaymentSubmit = async () => {
        if (!userId) {
            alert("Please log in to place an order.");
            return;
        }

        const orderSummary = {
            orderId: 'ORD' + Date.now(),
            items: cartItems,
            total: cartTotal,
            address: addressDetails,
            paymentMethod: selectedPayment,
            date: new Date().toISOString()
        };

        if (selectedPayment === 'cod') {
            const backendPayload = {
                userId,
                email: userEmail,
                items: cartItems.map(item => ({
                    productId: item.productId?._id || item.productId?.id || item.productId?.product_id || (typeof item.productId === 'string' ? item.productId : item.id),
                    quantity: item.quantity,
                    price: item.productId?.price || item.price
                })),
                total: cartTotal,
                address: addressDetails,
                paymentMethod: 'cod',
                orderId: orderSummary.orderId,
                date: orderSummary.date
            };
            await finalizeOrder(backendPayload, orderSummary);
            return;
        }

        setIsProcessing(true);
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Razorpay SDK failed to load.");
                setIsProcessing(false);
                return;
            }

            const orderRes = await fetch(`${API_BASE_URL}/create-razorpay-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ amount: cartTotal })
            });
            const razorpayOrder = await orderRes.json();
            if (!orderRes.ok) throw new Error(razorpayOrder.error || "Failed to create payment order");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "My Store",
                description: "Purchase payment",
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(`${API_BASE_URL}/verify-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            const backendPayload = {
                                userId,
                                email: userEmail,
                                items: cartItems.map(item => ({
                                    productId: item.productId?._id || item.productId?.id || item.productId?.product_id || (typeof item.productId === 'string' ? item.productId : item.id),
                                    quantity: item.quantity,
                                    price: item.productId?.price || item.price
                                })),
                                total: cartTotal,
                                address: addressDetails,
                                paymentMethod: selectedPayment,
                                orderId: orderSummary.orderId,
                                date: orderSummary.date,
                                transactionDetails: {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    verifiedAutomatically: true
                                }
                            };
                            await finalizeOrder(backendPayload, orderSummary);
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err) {
                        alert("Error during verification.");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: addressDetails.fullName,
                    email: userEmail,
                    contact: addressDetails.phone
                },
                theme: { color: "#f00606" },
                modal: { ondismiss: () => setIsProcessing(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Payment Init Error: " + error.message);
            setIsProcessing(false);
        }
    };

    const generateUPILink = () => {
        const amount = cartTotal.toFixed(2);
        return `upi://pay?pa=${merchantDetails.upiId}&pn=${merchantDetails.merchantName}&am=${amount}&cu=INR`;
    };

    if (step === 1) {
        return (
            <div className="checkout-page">
                <h1 id="deliver-page-heading" style={{ marginTop: '50px' }}>Delivery Address</h1>
                <DeliveryAddress
                    onSelectAddress={(addr) => setAddressDetails(addr)}
                    selectedAddressId={addressDetails._id || addressDetails.id}
                />
                <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                    <h3>Selected Address Preview</h3>
                    {addressDetails.address ? (
                        <div style={{ textAlign: 'left', maxWidth: '500px', margin: '10px auto', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <p><strong>Name:</strong> {addressDetails.fullName}</p>
                            <p><strong>Phone:</strong> {addressDetails.phone}</p>
                            <p><strong>Address:</strong> {addressDetails.address}, {addressDetails.city}, {addressDetails.state} - {addressDetails.pincode}</p>
                        </div>
                    ) : (
                        <p style={{ color: '#666' }}>Please select or add an address above.</p>
                    )}
                    <button onClick={() => setStep(2)} className="submit-btn" disabled={!addressDetails.address} style={{ maxWidth: '300px', marginTop: '15px', opacity: !addressDetails.address ? 0.6 : 1, cursor: !addressDetails.address ? 'not-allowed' : 'pointer' }}>
                        Continue to Payment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 id="payment-heading">Payment Methods</h1>
            <div className="payment-container">
                <div className="payment-methods">
                    <div className="payment-option">
                        <input type="radio" id="upi" name="payment" value="upi" onChange={(e) => setSelectedPayment(e.target.value)} />
                        <label htmlFor="upi"><i className="bi bi-phone"></i> UPI Payment (Automatic Verification)</label>
                    </div>
                    {selectedPayment === 'upi' && (
                        <div className="upi-details auto-verify">
                            <p>Razorpay Secure UPI Payment</p>
                            <button onClick={handlePaymentSubmit} disabled={isProcessing} className="btn btn-primary">
                                {isProcessing ? "Opening Secure Payment..." : "Pay Using UPI / QR"}
                            </button>
                        </div>
                    )}

                    <div className="payment-option">
                        <input type="radio" id="card" name="payment" value="card" onChange={(e) => setSelectedPayment(e.target.value)} />
                        <label htmlFor="card"><i className="bi bi-credit-card"></i> Credit/Debit Card</label>
                    </div>
                    {selectedPayment === 'card' && (
                        <div className="upi-details auto-verify">
                            <p>Razorpay Secure Card Payment</p>
                            <button onClick={handlePaymentSubmit} disabled={isProcessing} className="btn btn-primary">
                                {isProcessing ? "Opening Secure Payment..." : "Pay Using Card"}
                            </button>
                        </div>
                    )}

                    <div className="payment-option">
                        <input type="radio" id="cod" name="payment" value="cod" onChange={(e) => setSelectedPayment(e.target.value)} />
                        <label htmlFor="cod"><i className="bi bi-cash"></i> Cash on Delivery</label>
                    </div>
                </div>

                <div className="order-summary-payment">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cartItems.map((item, index) => {
                            const productId = item.productId?._id || item.productId?.id || item.productId?.product_id || (typeof item.productId === 'string' ? item.productId : null);
                            const uniqueKey = item._id || productId || index;
                            const title = item.productId?.title || item.title || "Product";
                            const price = item.productId?.price || item.price || 0;

                            return (
                                <div key={uniqueKey} className="summary-item">
                                    <span>{title} x {item.quantity}</span>
                                    <span>₹ {(price * item.quantity).toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="summary-row total">
                        <span>Total Amount:</span>
                        <span>₹ {(cartTotal + (selectedPayment === 'cod' ? 40 : 0)).toFixed(2)}</span>
                    </div>
                    {selectedPayment === 'cod' && (
                        <button onClick={handlePaymentSubmit} className="place-order-btn">Place Order (COD)</button>
                    )}
                    <button onClick={() => setStep(1)} className="back-btn">Back to Address</button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
