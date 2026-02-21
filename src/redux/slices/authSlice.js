import { createSlice } from '@reduxjs/toolkit';

const getSafeItem = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined" || item === "null") return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getSafeItem('user'),
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  firstName: localStorage.getItem('firstName') || '',
  lastName: localStorage.getItem('lastName') || '',
  email: localStorage.getItem('email') || '',
  phone: localStorage.getItem('phone') || '',
  userId: localStorage.getItem('userId') || null,
  cart: [],
  orders: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, userId, firstName, lastName, email, phone, cart, orders, token } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.userId = userId;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.phone = phone;
      state.cart = cart || [];
      state.orders = orders || [];

      // Update localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', userId);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('email', email);
      localStorage.setItem('phone', phone);
      if (token) localStorage.setItem('authToken', token);

      // We generally don't want to store large objects like cart/orders in localStorage string unless necessary for persistence
      // For now we will rely on Redux state, but if persistence across refresh is needed we can add them.
      // Given the requirement to display them, let's keep them in Redux primarily.
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.userId = null;
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.phone = '';

      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('email');
      localStorage.removeItem('phone');
      localStorage.removeItem('authToken');
    },
    updateUserProfile: (state, action) => {
      const { firstName, lastName, email, phone } = action.payload;
      if (firstName) state.firstName = firstName;
      if (lastName) state.lastName = lastName;
      if (email) state.email = email;
      if (phone) state.phone = phone;

      // Update user object if it exists
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }

      if (firstName) localStorage.setItem('firstName', firstName);
      if (lastName) localStorage.setItem('lastName', lastName);
      if (email) localStorage.setItem('email', email);
      if (phone) localStorage.setItem('phone', phone);
    }
  },
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
