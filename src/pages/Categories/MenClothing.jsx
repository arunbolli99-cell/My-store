import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Footer from '../../components/Footer/Footer';
import "./CategoryPage.css";

function MenClothing() {
    const [menProducts, setMenProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiService.getProducts();
                setMenProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h2>Men's Clothing</h2>
            <div className="products-wrapper">
                {menProducts.filter(item => item.category === "men's Clothing").map((item) => (
                    <Link to={`/product/${item.product_id || item.id}`} key={item.product_id || item.id} className="link_tag">
                        <div key={item.product_id || item.id} className="products-container">
                            <img id="apimage" src={item.image} alt={item.title} width="160px" height="160px" />
                            <span id="title">{item.title}</span>
                            <span id="description">{item.description}</span>
                            <span id="price">Price: ₹ {item.price}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default MenClothing;