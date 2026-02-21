import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../api/apiService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Footer from '../../components/Footer/Footer';
import "./CategoryPage.css";

function Accessories() {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiService.getProducts();
                setAccessories(data);
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
            <h2>Accessories</h2>
            <div className="products-wrapper">
                {accessories.filter(item => item.category === "accessories").map((item) => (
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

export default Accessories;