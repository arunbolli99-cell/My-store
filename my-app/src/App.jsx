

import AppRoutes from "./Routes.jsx";
import { CartProvider } from "./CartContext.jsx";

function App() {
   return( 
   <>
    <CartProvider>

   
      <AppRoutes />

    </CartProvider>
    
   </>
    )

}

export default App;
