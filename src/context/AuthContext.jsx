/* ===== IMPORTS ===== */
import React, { createContext, useState, useContext, useEffect } from 'react';

/* ===== CREATE CONTEXT ===== */
const AuthContext = createContext(null);

/* ===== PROVIDER COMPONENT ===== */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('smeflow_admin_auth') === 'true';
    });

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('smeflow_admin_auth', 'true');
        } else {
            localStorage.removeItem('smeflow_admin_auth');
        }
    }, [isAuthenticated]);

    const login = (password) => {
        if (password === 'smeflowadminArpit') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/* ===== CUSTOM HOOK ===== */
export const useAuth = () => {
    return useContext(AuthContext);
};
