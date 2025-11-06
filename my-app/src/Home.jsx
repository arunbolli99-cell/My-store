import React, { useState } from "react";
import { Link } from "react-router-dom";
import productData from './Products_images/Products_data';
import Products_images from "./Products_images/index.js";

function Home() {
    const [cat] = useState(productData);

    
    return (
        <div>
            <main>
            <h1 id="heading2">Welcome to Home page</h1>
            <p>I am Home page component</p>
            <div className="slid_container">
                 <img id="sale_banner" src={Products_images.biggest_sale_banner} width="1400px" height="400px"/>          
            </div>
            
                <div className="products-wrapper">
                    {cat.map((item) => (
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
            </main>
            <footer className="footer">
                <p>Copyright © 2025 My Website. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home;
