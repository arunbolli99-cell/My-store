

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.cartItems.push({ ...product, quantity: product.quantity || 1 });
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },

    // Update quantity of a cart item
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    // Replace entire cart (from backend)
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },

    // Clear cart
    clearCartState: (state) => {
      state.cartItems = [];
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, setCart, clearCartState } = cartSlice.actions;

// Memoization-safe selectors
export const selectCartItems = (state) => state?.cart?.cartItems || [];

export const selectCartTotal = (state) =>
  state?.cart?.cartItems?.reduce(
    (total, item) => {
        const price = item.productId?.price || item.price || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
    },
    0
  ) || 0;

export const selectCartCount = (state) =>
  state?.cart?.cartItems?.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  ) || 0;

// Export reducer
export default cartSlice.reducer;



// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   cartItems: [],
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     setCart: (state, action) => {
//       state.cartItems = action.payload;
//     },
//     clearCartState: (state) => {
//       state.cartItems = [];
//     },
//   },
// });

// export const { setCart, clearCartState } = cartSlice.actions;

// export const selectCartItems = (state) =>
//   state?.cart?.cartItems || [];

// export const selectCartTotal = (state) =>
//   state?.cart?.cartItems?.reduce(
//     (total, item) =>
//       total + (item.productId?.price || 0) * item.quantity,
//     0
//   ) || 0;

// export const selectCartCount = (state) =>
//   state?.cart?.cartItems?.reduce(
//     (count, item) => count + item.quantity,
//     0
//   ) || 0;

// export default cartSlice.reducer;


// // import { createSlice } from '@reduxjs/toolkit';


// // const initialState = {
// //   cartItems: [],
// // };

// // const cartSlice = createSlice({
// //   name: 'cart',
// //   initialState,
// //   reducers: {
// //     addToCart: (state, action) => {
// //       const product = action.payload;
// //       const existingItem = state.cartItems.find(item => item.id === product.id);
      
// //       if (existingItem) {
// //         existingItem.quantity += 1;
// //       } else {
// //         state.cartItems.push({ ...product, quantity: 1 });
// //       }
      
// //       localStorage.setItem('cart', JSON.stringify(state.cartItems));
// //     },
// //     removeFromCart: (state, action) => {
// //       const productId = action.payload;
// //       state.cartItems = state.cartItems.filter(item => item.id !== productId);
// //       localStorage.setItem('cart', JSON.stringify(state.cartItems));
// //     },
// //     updateQuantity: (state, action) => {
// //       const { id, quantity } = action.payload;
// //       if (quantity <= 0) {
// //         state.cartItems = state.cartItems.filter(item => item.id !== id);
// //       } else {
// //         const item = state.cartItems.find(item => item.id === id);
// //         if (item) {
// //           item.quantity = quantity;
// //         }
// //       }
// //       localStorage.setItem('cart', JSON.stringify(state.cartItems));
// //     },
// //     clearCart: (state) => {
// //       state.cartItems = [];
// //       localStorage.setItem('cart', JSON.stringify(state.cartItems));
// //     },

// //     setCart: (state, action) => {
// //   state.cartItems = action.payload;
// //   localStorage.setItem('cart', JSON.stringify(state.cartItems));
// // },

// //   },
// // });

// // export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// // // Selectors
// // export const selectCartItems = (state) => state.cart.cartItems;
// // export const selectCartTotal = (state) => 
// //   state.cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// // export const selectCartCount = (state) => 
// //   state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

// // export default cartSlice.reducer;
