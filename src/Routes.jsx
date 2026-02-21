
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import MenClothing from "./pages/Categories/MenClothing.jsx";
import WomenClothing from "./pages/Categories/WomenClothing.jsx";
import Beauty from "./pages/Categories/Beauty.jsx";
import Accessories from "./pages/Categories/Accessories.jsx";
import Electronics from "./pages/Categories/Electronics.jsx";
import Kitchen from "./pages/Categories/Kitchen.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import About from "./pages/Static/About.jsx";
import Contact from "./pages/Static/Contact.jsx";
import Product from "./pages/Product/Product.jsx";
import CartPage from "./pages/Cart/Cart_page.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import SignIn from "./pages/Auth/Sign_in.jsx";
import SignUp from "./pages/Auth/Sign_up.jsx";
import AccountPage from "./pages/Account/Account.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/mensclothing" element={<MenClothing />} />
        <Route path="/womensclothing" element={<WomenClothing />} />
        <Route path="/beauty" element={<Beauty />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/delivery-address" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default AppRoutes;
