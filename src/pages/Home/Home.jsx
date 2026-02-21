
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSearchQuery } from "../../redux/slices/searchSlice";
import { Link } from "react-router-dom";
import { apiService } from '../../api/apiService';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import "../Categories/CategoryPage.css";

function Home() {
    const searchQuery = useSelector(selectSearchQuery);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiService.getProducts();
                setProducts(data);
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
            <main>
                <h1 id="heading2"><i className="bi bi-stars"></i> Welcome to My Store</h1>
                <p>Where Smart Shopping Begins Here</p>
                <BannerSlider />

                <div className="products-wrapper">
                    {(() => {
                        const filteredProducts = products.filter(item =>
                            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (searchQuery && filteredProducts.length === 0) {
                            return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "20px", width: "100%" }}>No result found</div>;
                        }

                        return filteredProducts.map((item) => (
                            <Link to={`/product/${item.product_id || item.id}`} className="link_tag" key={item.product_id || item.id}>
                                <div className="products-container">
                                    <img id="apimage" src={item.image} alt={item.title} width="160px" height="160px" />
                                    <span id="title">{item.title}</span>
                                    <span id="description">{item.description}</span>
                                    <span id="price">Price: ₹ {item.price}</span>
                                </div>
                            </Link>
                        ));
                    })()}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Home;