import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService";
import "./Orders.css"

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
      if (err.message.includes("Invalid or expired token")) {
        navigate("/sign-in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div><h1 id="heading3">Loading orders...</h1></div>;
  }

  if (error) {
    return <div><h1 id="heading3">Error: {error}</h1></div>;
  }

  return (
    <div>
      <h1 id="heading3">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              <h3>Order #{order.orderId || index + 1}</h3>
              <p><strong>Date:</strong> {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status || 'Pending'}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount || 0}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
              <h4>Items:</h4>
              <ul>
                {order.items && order.items.map((item, i) => (
                  <li key={i}>{item.title || item.name} x {item.quantity} - ₹{item.price}</li>
                ))}
              </ul>
              {order.address && (
                <div>
                  <h4>Delivery Address:</h4>
                  <p>{order.address.street || order.address.address}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found for your account.</p>
      )}
    </div>
  );
}

export default Orders;
