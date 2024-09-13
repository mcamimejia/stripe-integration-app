import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
    token: string;
    userEmail: string;
    userId: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userEmail: string, userId: string) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
    loading: false,
});

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({ token, userEmail: parsedUser.userEmail, userId: parsedUser.userId });
        }
        setLoading(false);
    }, []);

    const login = (token: string, userEmail: string, userId: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ userEmail, userId }));
        setUser({ token, userEmail, userId });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;