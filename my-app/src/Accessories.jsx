import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import productData from './Products_images/Products_data.js';


function Accessories() {
    const [accessories] = useState(productData);
    
    return (
        <div>
            <h2>Accessories</h2>
            <div className="products-wrapper">
                {accessories.filter(item => item.category==="accessories").map((item) => (
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

export default Accessories;