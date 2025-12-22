
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import Categories from "./Categories.jsx";
import MenClothing from "./MenClothing.jsx";
import WomenClothing from "./WomenClothing.jsx";
import Beauty from "./Beauty.jsx";
import Accessories from "./Accessories.jsx";
import Electronics from "./Electronics.jsx";
import Kitchen from "./Kitchen.jsx";
import Orders from "./Orders.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import Product from "./Product.jsx";
import CartPage from "./Cart_page.jsx";
import Checkout from "./Checkout.jsx";
import SignIn from "./Sign_in.jsx";
import SignUp from "./Sign_up.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

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
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/delivery-address" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
