import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCart, selectCartItems, selectCartTotal } from "../../redux/slices/cartSlice";
import apiService from "../../api/apiService";
import "./Cart.css";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const loadCart = async () => {
    try {
      const data = await apiService.getCart();
      console.log("Cart Data from API:", data);

      let items = data.cart?.products_items || data.products_items || (Array.isArray(data) ? data : []);

      // Check if we need to manually populate product details
      const needsPopulation = Array.isArray(items) && items.some(item =>
        item && (typeof item.productId === 'string' || (item.productId && !item.productId.title))
      );

      if (needsPopulation && items.length > 0) {
        console.log("Cart items missing details, fetching products to populate...");
        try {
          const allProducts = await apiService.getProducts();
          const productsArray = Array.isArray(allProducts) ? allProducts : [];

          items = items.map(item => {
            if (!item) return item;
            // If already populated, keep it
            if (typeof item.productId === 'object' && item.productId?.title) {
              return item;
            }

            // Find the product details
            const searchId = typeof item.productId === 'string'
              ? item.productId
              : (item.productId?._id || item.productId?.id || item.productId?.product_id);

            const productDetails = productsArray.find(p =>
              p && (p._id === searchId || p.id === searchId || p.product_id === searchId)
            );

            if (productDetails) {
              return { ...item, productId: productDetails };
            }
            return item;
          });
        } catch (err) {
          console.error("Failed to fetch products for population:", err);
        }
      }

      dispatch(setCart(Array.isArray(items) ? items : []));
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await apiService.removeFromCart(cartItemId);
      await loadCart(); // refresh from backend
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const handleUpdateQuantity = async (productId, cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await apiService.updateCart(productId, newQuantity);
      await loadCart(); // refresh
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await apiService.clearCart();
      dispatch(setCart([]));
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    navigate("/delivery-address");
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>
        <Link to="/">
          <button>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 id="heading2">Shopping Cart</h1>
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item, index) => {
            const cartItemId = item._id;
            const productId = item.productId?._id || item.productId?.id || item.productId?.product_id || (typeof item.productId === 'string' ? item.productId : null);

            // Use cartItemId if available, otherwise fallback to productId, or index as last resort for key
            const uniqueKey = cartItemId || productId || index;
            const idForActions = cartItemId || productId;

            if (!idForActions) {
              console.warn("Cart item missing _id and productId:", item);
              return null;
            }

            return (
              <div key={uniqueKey} className="cart-item">
                <img src={item.productId?.image} alt={item.productId?.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.productId?.title}</h3>
                  <p className="cart-item-category">{item.productId?.category}</p>
                  <p className="cart-item-price">₹ {item.productId?.price}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(productId, cartItemId, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={!productId || !cartItemId}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(productId, cartItemId, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={!productId}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-total">₹ {((item.productId?.price || 0) * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(cartItemId)}
                    className="remove-btn"
                    disabled={!cartItemId}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹ {cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹ {cartTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          <button onClick={handleClearCart} className="clear-cart-btn">Clear Cart</button>
          <Link to="/categories">
            <button className="continue-shopping-btn">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;