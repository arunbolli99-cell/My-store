import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiService from "../../api/apiService";
import "./Orders.css"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

function Orders() {
  const reduxOrders = useSelector((state) => state.auth.orders);
  const [orders, setOrders] = useState(reduxOrders);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  console.log("Orders Component - Redux Orders:", reduxOrders);
  console.log("Orders Component - Current State Orders:", orders);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Fetching orders from API...");

      const fetchOrders = async () => {
        try {
          setLoading(true);
          const data = await apiService.getOrders();
          console.log("API Orders Response:", data);
          // specific to the backend response structure
          const fetchedOrders = data.orders || data.user_orders || (Array.isArray(data) ? data : []);
          console.log("Parsed orders for state:", fetchedOrders);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          // If fetch fails, we already have reduxOrders in state, but we might want to ensure it's kept
          if (orders.length === 0 && reduxOrders && reduxOrders.length > 0) {
            setOrders(reduxOrders);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleCancelOrder = async (orderId) => {
    // If orderId is undefined, try to find it from the orders list (this shouldn't happen if passed correctly)
    if (!orderId) {
      console.error("No order ID provided for cancellation");
      return;
    }

    console.log("Attempting to cancel order with ID:", orderId);

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await apiService.cancelOrder(orderId);
        // Update the status of the cancelled order immediately
        setOrders(prevOrders => prevOrders.map(order =>
          (order.orderId === orderId || order._id === orderId)
            ? { ...order, status: "Cancelled" }
            : order
        ));

        // Also update localStorage to reflect the cancellation
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedLocalOrders = localOrders.map(order =>
          (order.orderId === orderId || order._id === orderId)
            ? { ...order, status: "Cancelled" }
            : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedLocalOrders));

        alert("Order cancelled successfully");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order: " + error.message);
      }
    }
  };


  return (
    <div className="orders-page">
      <h1 id="heading3">Your Orders</h1>

      {loading ? (
        <div className="loading-container">
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id || order.orderId} className="order-item">

              {/* Header */}
              <div className="order-header">
                <h3 className="order-id">
                  Order ID : {order.orderId || order._id}
                </h3>
                <span className={`order-status ${order.status?.toLowerCase()}`}>
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Items */}
              <ul className="order-items">
                {(Array.isArray(order.products_items || order.order_items || order.cart_items || order.items || order.products) ? (order.products_items || order.order_items || order.cart_items || order.items || order.products) : []).map((item, index) => {
                  if (!item) return null;
                  const itemImage = item.image || item.img || item.productImage || item.cart_image || item.product?.image || item.product?.img;
                  const itemTitle = item.title || item.name || item.productName || item.cart_title || item.product?.title || `Product ID: ${item.productId || item.cart_productId}`;
                  const itemCategory = item.category || item.cart_category || item.product?.category || "General";
                  const itemPrice = Number(item.price || item.amount || item.productPrice || item.cart_price || item.product?.price || 0);
                  const itemQty = item.quantity || item.qty || item.cart_quantity || item.product?.quantity || 1;

                  return (
                    <li key={index} className="order-product-item">
                      {itemImage && (
                        <img
                          src={itemImage}
                          alt={itemTitle}
                          width={160}
                          height={160}
                          className="order-item-image"
                        />
                      )}

                      <div className="order-item-info">
                        <div className="item-name">
                          <strong>{itemTitle}</strong>
                        </div>
                        <div className="item-category">
                          <strong>Category :</strong> {itemCategory}
                        </div>
                        <div className="item-meta">
                          <strong>Qty : </strong> {itemQty} | <strong>Price :</strong> ₹{itemPrice.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Bottom summary (LIKE CART PAGE) */}
              <div className="order-summary">

                {/* ROW 1 */}
                <div className="summary-row top-row">
                  <span><strong>Date :</strong> {new Date(order.date || order.createdAt || order.order_date || Date.now()).toLocaleDateString()}</span>
                  <span><strong>Payment Method :</strong> {order.paymentMethod || order.order_payment || "Online Payment"}</span>
                </div>

                {/* ROW 2 */}
                <div className="summary-row bottom-row">
                  <span className="address">
                    <strong>Address :</strong> {typeof (order.address || order.order_address) === 'object' && (order.address || order.order_address) !== null
                      ? `${(order.address || order.order_address).address}, ${(order.address || order.order_address).city}, ${(order.address || order.order_address).state} - ${(order.address || order.order_address).pincode}`
                      : ((order.address || order.order_address) || "Not specified")}
                  </span>

                  <div className="amount">
                    <strong>Total Amount : </strong>
                    <strong>₹ {order.totalAmount || order.order_total || order.total || 0}</strong>
                  </div>



                </div>
                <button
                  className="cancel-order-btn"
                  disabled={order.status === "Delivered" || order.status === "Cancelled"}
                  onClick={() => {
                    // Prioritize orderId (ORD...) as backend likely expects it for lookup
                    const idToCancel = order.orderId || order._id;
                    handleCancelOrder(idToCancel);
                  }}>
                  Cancel Order
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
