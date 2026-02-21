import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Footer from '../../components/Footer/Footer';
import "./CategoryPage.css";

function WomenClothing() {
    const [womenClothing, setWomenClothing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiService.getProducts();
                setWomenClothing(data);
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
            <h2>Women's Clothing</h2>
            <div className="products-wrapper">
                {womenClothing.filter(item => item.category === "women's Clothing").map((item) => (
                    <Link to={`/product/${item.product_id || item.id}`} className="link_tag" key={item.product_id || item.id}>
                        <div className="products-container">
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

export default WomenClothing;