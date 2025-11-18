import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage
  useEffect(() => {
  const checkLogin = () => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  };

  checkLogin();

  // Re-run whenever route changes
  return () => {};
}, [location.pathname]);


  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/sign-in");
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <li id="menu"><i className="bi bi-list"></i></li>
          <li className="logo">MY STORE</li>
          <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link to="/categories" className={location.pathname === "/categories" ? "active" : ""}>Categories</Link></li>
          <li><Link to="/orders" className={location.pathname === "/orders" ? "active" : ""}>Orders</Link></li>
          <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
          <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link></li>
        </ul>

        <div className="search-container">
          <input id="input" placeholder="Search" />
          <button id="search-btn"><i className="bi bi-search"></i></button>
        </div>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/account">
                <button id="account-btn">
                  <i className="bi bi-person-circle profile-icon"></i>
                </button>
              </Link>

              <button id="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <button id="sign-in-btn">Sign-in</button>
              </Link>

              <Link to="/sign-up">
                <button id="sign-up-btn">Sign-Up</button>
              </Link>
            </>
          )}
        </div>

        <Link to="/cart">
          <button id="cart-btn">
            <i className="bi bi-cart-fill"></i>
            {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
          </button>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
