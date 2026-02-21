import React, { useState } from 'react';
import './Contact.css';

function Contact() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thank you! Your message has been sent.');
        e.target.reset();
    };

    return (
        <div className="contact-page">
            {/* Header */}
            <section className="contact-hero">
                <h1>Get in Touch</h1>
                <p>Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.</p>
            </section>

            <div className="contact-container">
                {/* Info Column */}
                <div className="contact-info">
                    <div className="info-card-premium">
                        <i className="bi bi-geo-alt"></i>
                        <div>
                            <h4>Visit Us</h4>
                            <p>123 Commerce Avenue, Suite 500<br />New York, NY 10001</p>
                        </div>
                    </div>
                    <div className="info-card-premium">
                        <i className="bi bi-envelope"></i>
                        <div>
                            <h4>Email Us</h4>
                            <p>support@mystore.com<br />info@mystore.com</p>
                        </div>
                    </div>
                    <div className="info-card-premium">
                        <i className="bi bi-telephone"></i>
                        <div>
                            <h4>Call Us</h4>
                            <p>+1 (555) 123-4567<br />Mon-Fri: 9am - 6pm EST</p>
                        </div>
                    </div>
                    <div className="info-card-premium">
                        <i className="bi bi-chat-text"></i>
                        <div>
                            <h4>Live Chat</h4>
                            <p>Available 24/7 for premium members via our dashboard.</p>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="contact-form-container">
                    <h2>Send a Message</h2>
                    {status && <p className="success-banner" style={{ color: '#28a745', fontWeight: '600', marginBottom: '20px' }}>{status}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group-contact">
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                            <div className="form-group-contact">
                                <label>Email Address</label>
                                <input type="email" placeholder="john@example.com" required />
                            </div>
                        </div>
                        <div className="form-group-contact">
                            <label>Subject</label>
                            <input type="text" placeholder="How can we help?" required />
                        </div>
                        <div className="form-group-contact">
                            <label>Message</label>
                            <textarea rows="5" placeholder="Tell us more about your inquiry..." required></textarea>
                        </div>
                        <button type="submit" className="submit-contact-btn">Send Message</button>
                    </form>
                </div>
            </div>

            {/* Social Connect */}
            <section className="social-connect">
                <h3>Follow Our Journey</h3>
                <p>Stay updated with the latest trends and exclusive offers.</p>
                <div className="social-icons-row">
                    <a href="#" className="social-icon-circle"><i className="bi bi-facebook"></i></a>
                    <a href="#" className="social-icon-circle"><i className="bi bi-instagram"></i></a>
                    <a href="#" className="social-icon-circle"><i className="bi bi-twitter-x"></i></a>
                    <a href="#" className="social-icon-circle"><i className="bi bi-linkedin"></i></a>
                </div>
            </section>
        </div>
    );
}

export default Contact;