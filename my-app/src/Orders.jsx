import { useState, useEffect } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {
      const userOrders = storedOrders.filter(
        (order) => order.username === currentUser.username
      );
      setOrders(userOrders);
    }
  }, []);

  return (
    <div>
      <h1 id="heading3">Welcome to Orders page</h1>
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <h3>Order #{index + 1}</h3>
              <p><strong>Date:</strong> {order.date}</p>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>{item.name} - ₹{item.price}</li>
                ))}
              </ul>
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
