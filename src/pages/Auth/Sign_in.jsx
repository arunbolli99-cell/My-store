import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { setCart } from "../../redux/slices/cartSlice";
import { API_BASE_URL } from "../../api/apiService";
import "./SignIn.css";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Where to go after login — back to the page that triggered the redirect, or home
  const from = location.state?.from || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        const token = data.token || data.authToken || data.accessToken;
        if (token) localStorage.setItem("authToken", token);

        // Extract user details
        let firstName = data.firstName || data.user?.firstName;
        let lastName = data.lastName || data.user?.lastName || "";
        let email = data.email || formData.email;
        let phone = data.phone || "";
        let userCart = data.cart || [];

        if (userCart && !Array.isArray(userCart)) {
          if (userCart.products_items && Array.isArray(userCart.products_items)) {
            userCart = userCart.products_items;
          } else if (userCart.cart_items && Array.isArray(userCart.cart_items)) {
            userCart = userCart.cart_items;
          } else {
            userCart = [];
          }
        }

        if (!firstName) {
          const userData = data.user || data;
          firstName = userData.firstname || userData.name || userData.username || "User";
        }
        if (firstName === "User" && email) {
          const emailName = email.split("@")[0];
          if (emailName) firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }

        const user = { firstName, lastName, email, phone, userId: data.userId, username: email };

        dispatch(loginSuccess({ user, userId: data.userId, firstName, lastName, email, phone, cart: userCart, token }));
        dispatch(setCart(Array.isArray(userCart) ? userCart : []));

        navigate(from, { replace: true });
      } else {
        setError(data.message || data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signIn_container">
      <div className="signIn_box">
        <div className="signin-header">
          <div className="signin-icon">🔐</div>
          <h1>Sign In</h1>
          <p className="signin-subtitle">Welcome back! Please sign in to continue.</p>
        </div>

        <form className="sign-in_form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input
              id="username_input"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password <span className="required">*</span></label>
            <div className="password-input-wrapper">
              <input
                id="password_input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button className="submit_btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner"></span> Logging in...</span>
            ) : (
              "Sign In →"
            )}
          </button>

          <p className="signin-footer">
            Don't have an account? <a href="/sign-up">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
