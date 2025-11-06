
import React, { useState} from "react";
import { Link } from "react-router-dom";
import productData from './Products_images/Products_data';

function Categories() {
    const [cat] = useState(productData);
    

    return (
        <div>
            <main>
            <h1 id="heading2">Welcome to Categories page</h1>
            <p>I am Categories page component</p>
            <div className="container">
                <Link to="/mensclothing" className="div1" id="div">Men's</Link>
                <Link to="/womensclothing" className="div2" id="div">Women's</Link>
                <Link to="/beauty" className="div3" id="div">Beauty</Link>
                <Link to="/accessories" className="div4" id="div">Accessories</Link>
                <Link to="/electronics" className="div5" id="div">Electronics</Link>
                <Link to="/kitchen" className="div6" id="div">Kitchen</Link>
            </div>

            {
               
                <div className="products-wrapper">
                    {cat.map((item) => (
                        <Link to={`/product/${item.id}`} className="link_tag" key={item.id}>
                            <div key={item.id} className="products-container">
                            <img id="apimage" src={item.image} alt={item.title} width="160px" height="160px" />
                            <span id="title">{item.title}</span>
                            <span id="description">{item.description}</span>
                            <span id="price">Price: ₹ {item.price}</span>
                        </div>
                        </Link>
                    ))}
                </div>
            }
            </main>
            <footer className="footer">
                <p>Copyright © 2025 My Website. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Categories;
