
import { Link} from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import productData from './Products_images/Products_data.js';

function Product() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const product = productData.find(p => p.id === parseInt(productId));

    if (!product) {
        return <div>Product not found!</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        alert('Product added to cart!');
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
                    <Link to="/delivery-address"><button id="buy_now">Buy Now</button></Link>
                </div>
            </div>
        </>
    );
}

export default Product;