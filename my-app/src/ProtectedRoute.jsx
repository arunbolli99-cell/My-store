import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }
    
    return children;
}

export default ProtectedRoute;
