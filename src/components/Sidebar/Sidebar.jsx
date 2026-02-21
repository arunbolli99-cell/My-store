
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isLoggedIn, handleLogout, firstName }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {isLoggedIn ? (
             <Link to="/account" onClick={onClose} className="profile-link">
               <i className="bi bi-person-circle profile-icon-large"></i>
               <div className="profile-info">
                  <span className="profile-name">{firstName}</span>
               </div>
             </Link>
          ) : (
             <div className="profile-info">
                <span className="profile-name">My Store</span>
             </div>
          )}
          <button className="close-btn" onClick={onClose}>
             <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <Link to="/" onClick={onClose}>
              <i className="bi bi-house-door"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/categories" onClick={onClose}>
              <i className="bi bi-grid"></i> Categories
            </Link>
          </li>
          <li>
            <Link to={isLoggedIn ? "/orders" : "/sign-in"} onClick={onClose}>
              <i className="bi bi-bag"></i> Orders
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={onClose}>
              <i className="bi bi-info-circle"></i> About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={onClose}>
              <i className="bi bi-envelope"></i> Contact
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          {isLoggedIn ? (
             <button className="sidebar-btn logout-sidebar-btn" onClick={() => { handleLogout(); onClose(); }}>Logout</button>
          ) : (
            <>
              <Link to="/sign-in" onClick={onClose} style={{textDecoration: 'none'}}>
                <button className="sidebar-btn signin-btn">Sign In</button>
              </Link>
              <Link to="/sign-up" onClick={onClose} style={{textDecoration: 'none'}}>
                <button className="sidebar-btn signup-btn">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
