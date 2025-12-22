

import AppRoutes from "./Routes.jsx";
import { CartProvider } from "./CartContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";

function App() {
   return( 
   <>
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
   </>
    )

}

export default App;
