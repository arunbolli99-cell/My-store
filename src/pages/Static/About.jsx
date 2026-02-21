import React from 'react';
import './About.css';

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Crafting Better Shopping</h1>
                    <p>Redefining your digital retail experience with quality, trust, and exceptional service.</p>
                </div>
            </section>

            {/* Stats Row */}
            <section className="about-stats">
                <div className="stat-item">
                    <h3>50k+</h3>
                    <p>Happy Customers</p>
                </div>
                <div className="stat-item">
                    <h3>120+</h3>
                    <p>Premium Brands</p>
                </div>
                <div className="stat-item">
                    <h3>24/7</h3>
                    <p>Expert Support</p>
                </div>
                <div className="stat-item">
                    <h3>100%</h3>
                    <p>Secure Payments</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="about-container">
                <section className="about-section">
                    <div className="about-content">
                        <h2>Our Story</h2>
                        <p>Founded in 2024, My Store began with a simple vision: to make high-quality products accessible to everyone through a seamless digital experience.</p>
                        <p>What started as a small electronics boutique has evolved into a comprehensive lifestyle destination, curated with care for our global community.</p>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Our Team" />
                    </div>
                </section>

                <section className="about-section">
                    <div className="about-content">
                        <h2>Personalized Excellence</h2>
                        <p>We believe that every customer is unique. Our platform uses cutting-edge technology to suggest products that fit your lifestyle, while maintaining a human touch in our customer relations.</p>
                        <p>Our commitment to excellence drives us to constantly innovate, ensuring you always get the best products at the best value.</p>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80" alt="Innovation" />
                    </div>
                </section>
            </div>

            {/* Mission & Vision */}
            <section className="mission-vision">
                <div className="mv-container">
                    <div className="mv-card">
                        <i className="bi bi-eye"></i>
                        <h3>Our Vision</h3>
                        <p>To become the world's most customer-centric destination where people can find and discover anything they might want to buy online.</p>
                    </div>
                    <div className="mv-card">
                        <i className="bi bi-bullseye"></i>
                        <h3>Our Mission</h3>
                        <p>To elevate the standard of online retail by providing authentic products, innovative discovery tools, and an uncompromising level of service.</p>
                    </div>
                    <div className="mv-card">
                        <i className="bi bi-heart"></i>
                        <h3>Our Values</h3>
                        <p>Integrity, transparency, and obsession with quality are the pillars that support everything we build for our community.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;