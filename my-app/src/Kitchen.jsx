import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import productData from './Products_images/Products_data.js';


function Kitchen() {
    const [kitchen] = useState(productData);
    
    return (
        <div>
            <h2>Kitchen Products</h2>
            <div className="products-wrapper">
                {kitchen.filter(item => item.category==="kitchen_products").map((item) => (
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

export default Kitchen;