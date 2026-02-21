
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/slices/cartSlice";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./Product.css";

function Product() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const products = await apiService.getProducts();

                const found = products.find(p =>
                    p.id == productId ||
                    p.product_id == productId ||
                    p._id === productId
                );

                setProduct(found);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <LoadingSpinner />;
    if (!product) return <div>Product not found!</div>;

    const handleAddToCart = async () => {
        const productIdToSend = product._id || product.id || product.product_id;
        
        if (!productIdToSend) {
            console.error("Product has no valid ID:", product);
            alert("Error: Cannot add product without an ID");
            return;
        }

        try {
            await apiService.addToCart(productIdToSend, 1, product.price);

            const updatedCart = await apiService.getCart();

            dispatch(setCart(updatedCart.cart?.products_items || updatedCart.products_items || []));

            alert("Product added to cart!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add product. Try again.");
        }
    };

    const handleBuyNow = async () => {
        const productIdToSend = product._id || product.id || product.product_id;
        if (!productIdToSend) {
            alert("Error: Cannot purchase product without an ID");
            return;
        }

        try {
            // Ensure product is in database cart before checkout
            await apiService.addToCart(productIdToSend, 1, product.price);
            
            // Sync Redux store with backend cart before navigating
            const updatedCart = await apiService.getCart();
            dispatch(setCart(updatedCart.cart?.products_items || updatedCart.products_items || []));
            
            navigate("/delivery-address");
        } catch (error) {
            console.error("Buy Now failed:", error);
            // Even if add to cart fails (e.g. already in cart), try to proceed
            navigate("/delivery-address");
        }
    };

    return (
        <div className="single_product_container">
            <img
                id="product_image"
                src={product.image}
                alt={product.title}
                style={{ width: '500px', height: '500px' }}
            />
            <div className="product_details">
                <h1>{product.title}</h1>
                <p>Category : {product.category}</p>
                <h2>Price : ₹ {product.price}</h2>
                <p>{product.description}</p>
                <p id="rating">Rating : {product.rating} / 5</p>
                <p id="stock">
                    In Stock : {product.inStock ? 'Yes' : 'No'}
                </p>
                <button id="add_to_cart" onClick={handleAddToCart}>
                    Add to Cart
                </button>
                <button id="buy_now" onClick={handleBuyNow}>
                    Buy Now
                </button>
            </div>
        </div>
    );
}

export default Product;



// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart, selectCartItems } from "./redux/slices/cartSlice";
// import { apiService } from './apiService';
// import LoadingSpinner from './LoadingSpinner';

// function Product() {
//     const { productId } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { isLoggedIn, userId } = useSelector((state) => state.auth);
//     const cartItems = useSelector(selectCartItems);

//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const products = await apiService.getProducts();
//                 console.log("All Products:", products);
//                 console.log("Searching for ID:", productId);
                
//                 const found = products.find(p => 
//                     p.id == productId || p.product_id == productId || p._id === productId
//                 );
                
//                 console.log("Found Product:", found);
//                 setProduct(found);
//             } catch (error) {
//                 console.error("Failed to fetch product", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [productId]);

//     if (loading) {
//         return <LoadingSpinner />;
//     }
    
//     if (!product) {
//         return <div>Product not found!</div>;
//     }

//       const handleAddToCart = async () => {
//     if (!isLoggedIn) {
//         navigate("/sign-in");
//         return;
//     }

//     try {
//         await apiService.addToCart(product._id, 1, product.price);

//         // Only update Redux after backend success
//         dispatch(addToCart(product));

//         alert("Product added to cart!");
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         alert("Failed to add product. Try again.");
//     }
// };


//     // const handleAddToCart = () => {
//     //     if (!isLoggedIn) {
//     //         navigate("/sign-in");
//     //         return;
//     //     }
//     //     dispatch(addToCart(product));

//     //     if (userId) {
//     //         const updatedCart = [...cartItems];
//     //         const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

//     //         if (existingItemIndex > -1) {
//     //             const existingItem = updatedCart[existingItemIndex];
//     //             updatedCart[existingItemIndex] = {
//     //                 ...existingItem,
//     //                 quantity: existingItem.quantity + 1
//     //             };
//     //         } else {
//     //             updatedCart.push({ ...product, quantity: 1 });
//     //         }

//     //         const totalAmount = updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0);

//     //         const orderData = {
//     //             cart_userId: userId,
//     //             cart_items: updatedCart.map(item => ({
//     //                 cart_productId: item.id,
//     //                 cart_title: item.title,
//     //                 cart_category: item.category,
//     //                 cart_price: item.price,
//     //                 cart_image: item.image,
//     //                 cart_description: item.description,
//     //                 cart_inStock: item.inStock,
//     //                 cart_quantity: item.quantity
//     //             })),
//     //             cart_totalAmount: totalAmount
//     //         };

//     //         console.log("Syncing cart to backend:", orderData);
//     //         fetch("/usercart", {
//     //             method: "POST",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify(orderData)
//     //         })
//     //         .then(res => res.json())
//     //         .then(data => console.log("Cart sync response:", data))
//     //         .catch(err => console.error("Error syncing cart:", err));
//     //     }

//     //     alert('Product added to cart!');
//     // };

//     const handleBuyNow = () => {
//         if (!isLoggedIn) {
//             navigate("/sign-in");
//         } else {
//             navigate("/delivery-address");
//         }
//     };

//     return (
//         <>
//             <div className="single_product_container">
//                 <img id="product_image" src={product.image} alt={product.title} style={{ width: '500px', height: '500px' }} />
//                 <div className="product_details">
//                     <h1>{product.title}</h1>
//                     <p>Category : {product.category}</p>
//                     <h2>Price : ₹ {product.price}</h2>
//                     <p>{product.description}</p>
//                     <p id="rating">Rating : {product.rating} / 5</p>
//                     <p id="stock">In Stock : {product.inStock ? 'Yes' : 'No'}</p>
//                     <button id="add_to_cart" onClick={handleAddToCart}>Add to Cart</button>
//                     <button id="buy_now" onClick={handleBuyNow}>Buy Now</button>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Product;