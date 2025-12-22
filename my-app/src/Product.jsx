
import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import productData from './Products_images/Products_data.js';

function Product() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const product = productData.find(p => p.id === parseInt(productId));

    if (!product) {
        return <div>Product not found!</div>;
    }

    const handleAddToCart = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in first to add items to cart");
            navigate("/sign-in");
            return;
        }
        const success = await addToCart(product);
        if (success) {
            alert('Product added to cart!');
        }
    };

    const handleBuyNow = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Please log in first to make a purchase");
            navigate("/sign-in");
            return;
        }
        const success = await addToCart(product);
        if (success) {
            navigate("/delivery-address");
        }
    };

    return (
        <>
            <div className="single_product_container">
                <img id="product_image" src={product.image} alt={product.title} style={{ width: '500px', height: '500px' }} />
                <div className="product_details">
                    <h1>{product.title}</h1>
                    <p>Category : {product.category}</p>
                    <h2>Price : ₹ {product.price}</h2>
                    <p>{product.description}</p>
                    <p id="rating">Rating : {product.rating} / 5</p>
                    <p id="stock">In Stock : {product.inStock ? 'Yes' : 'No'}</p>
                    <button id="add_to_cart"onClick={handleAddToCart}>Add to Cart</button>
                    <button id="buy_now" onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </>
    );
}

export default Product;