
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }) {
  const authState = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("AUTH STATE:", authState);

  if (!authState?.isLoggedIn) {
    console.log("Redirecting because isLoggedIn is false");
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// export function ProtectedRoute({ children }) {
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

//   if (!isLoggedIn) {
//     return <Navigate to="/sign-in" replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;


// import { Navigate } from 'react-router-dom';

// export function ProtectedRoute({ children }) {
//     const token = localStorage.getItem('authToken');
    
//     if (!token) {
//         return <Navigate to="/sign-in" replace />;
//     }
    
//     return children;
// }

// export default ProtectedRoute;
