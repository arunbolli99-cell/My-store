
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../../redux/slices/cartSlice";
import { logout } from "../../redux/slices/authSlice";
import { setSearchQuery } from "../../redux/slices/searchSlice";
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { API_BASE_URL } from "../../api/apiService";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector(selectCartCount);
  const { isLoggedIn, firstName, user } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/sign-in");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    dispatch(setSearchQuery(searchTerm));
  };

  return (
    <div className="navbar-wrapper">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        firstName={firstName}
      />
      <nav className="navbar">
        <ul className="nav-links">
          <li id="menu" onClick={() => setIsSidebarOpen(true)}><i className="bi bi-list"></i></li>
          <li className="logo">MY STORE</li>
          <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link to="/categories" className={location.pathname === "/categories" ? "active" : ""}>Categories</Link></li>
          <li><Link to={isLoggedIn ? "/orders" : "/sign-in"} className={location.pathname === "/orders" ? "active" : ""}>Orders</Link></li>
          <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
          <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link></li>
        </ul>

        <div className="search-container">
          <input
            id="input"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button id="search-btn" onClick={handleSearch}><i className="bi bi-search"></i></button>
        </div>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/account">
                <button id="account-btn">
                  {user?.profilePic ? (
                    <img
                      src={`${API_BASE_URL}${user.profilePic}`}
                      alt="Profile"
                      className="navbar-profile-img"
                    />
                  ) : (
                    <i className="bi bi-person-circle profile-icon"></i>
                  )}
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

        <button id="cart-btn" onClick={handleCartClick}>
          <i className="bi bi-cart-fill"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
