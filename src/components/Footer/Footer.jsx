import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section brand-section">
                    <h2 className="footer-logo">MY STORE</h2>
                    <p className="footer-tagline">Premium Shopping Experience</p>
                    <div className="social-icons">
                        <a href="#"><i className="bi bi-facebook"></i></a>
                        <a href="#"><i className="bi bi-instagram"></i></a>
                        <a href="#"><i className="bi bi-twitter-x"></i></a>
                        <a href="#"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Categories</h3>
                    <ul>
                        <li><Link to="/mensclothing">Men's Clothing</Link></li>
                        <li><Link to="/womensclothing">Women's Clothing</Link></li>
                        <li><Link to="/electronics">Electronics</Link></li>
                        <li><Link to="/beauty">Beauty</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <h3>Contact Us</h3>
                    <p><i className="bi bi-envelope-fill"></i> support@mystore.com</p>
                    <p><i className="bi bi-telephone-fill"></i> +91 98765 43210</p>
                    <p><i className="bi bi-geo-alt-fill"></i> Hyderabad, India</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} My Store. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
