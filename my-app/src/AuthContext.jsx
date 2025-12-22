import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function UseAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return null;
        
        return {
            userId: userId,
            firstName: localStorage.getItem('firstName') || '',
            lastName: localStorage.getItem('lastName') || '',
            email: localStorage.getItem('email') || '',
        };
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('authToken');
    });

    const signup = (userData) => {
        localStorage.setItem('firstName', userData.firstName);
        localStorage.setItem('lastName', userData.lastName);
        localStorage.setItem('email', userData.email);
        return { success: true, message: 'Account created successfully!' };
    };

    const signin = (loginData) => {
        const { token, userId, firstName, lastName, email } = loginData;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);
        
        setCurrentUser({ userId, firstName, lastName, email });
        setIsAuthenticated(true);
        
        return { success: true, message: 'Signed in successfully!' };
    };

    const signout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('cart');
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        currentUser,
        signin,
        signout,
        signup,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;