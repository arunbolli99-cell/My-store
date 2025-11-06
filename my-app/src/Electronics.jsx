import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import productData from './Products_images/Products_data.js';


function Electronics() {
    const [electronics] = useState(productData);
    
    return (
        <div>
            <h2 id="heading2">Electronics</h2>
            <div className="products-wrapper">
                {electronics.filter(item => item.category==="electronics").map((item) => (
                    <Link to={`/product/${item.id}`} className="link_tag" key={item.id}>
                    <div className="products-container">
                        <img id="apimage" src={item.image} alt={item.title} width="160px" height="160px" />
                        <span id="title">{item.title}</span>
                        <span id="description">{item.description}</span>
                        <span id="price">Price: ₹ {item.price}</span>
                    </div>
                    </Link>
                ))}
            </div>
            <footer className="footer">
                <p>Copyright © 2025 My Website. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Electronics;