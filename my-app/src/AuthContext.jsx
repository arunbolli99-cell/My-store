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
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('users');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    const signup = (userData) => {
        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        };

        setUsers(prevUsers => [...prevUsers, newUser]);
        return { success: true, message: 'Account created successfully!' };
    };

    const signin = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Don't store password in currentUser
            const { password, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            return { success: true, message: 'Signed in successfully!' };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const signout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateProfile = (updatedData) => {
        if (!currentUser) return { success: false, message: 'No user logged in' };

        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === currentUser.id ? { ...user, ...updatedData } : user
            )
        );

        return { success: true, message: 'Profile updated successfully!' };
    };

    const value = {
        currentUser,
        users,
        signup,
        signin,
        signout,
        updateProfile,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;