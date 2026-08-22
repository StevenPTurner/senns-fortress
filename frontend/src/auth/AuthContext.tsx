import React, { createContext, useState } from "react";
import env from "../lib/EnvReader";

interface AuthState {
    token: string | null;
    state: 'LOGGED_IN' | 'NOT_LOGGED_IN' | 'FAILED_LOGIN';
    email: string | null;
    login: (authState: {token: string, email: string}) => void;
    logout: () => void;
    failLogin: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return sessionStorage.getItem('loginToken');
    });
    const [state, setState] = useState<'LOGGED_IN' | 'NOT_LOGGED_IN' | 'FAILED_LOGIN'>(() => {
        if (env.get('AUTH_MODE') === 'SKIP') {
            return 'LOGGED_IN';
        }
        return token ? 'LOGGED_IN' : 'NOT_LOGGED_IN';
    });
    const [email, setEmail] = useState<string | null>(null);

    const login = (authState: {token: string, email: string}) => {
        setState('LOGGED_IN');
        setToken(authState.token);
        setEmail(authState.email);
        sessionStorage.setItem('loginToken', authState.token);
    }

    const logout = () => {
        setState('NOT_LOGGED_IN');
        setToken(null);
        setEmail(null);
        sessionStorage.removeItem('loginToken');
    }

    const failLogin = () => {
        setState('FAILED_LOGIN');
        setToken(null);
        setEmail(null);
        sessionStorage.removeItem('loginToken');
    }

    return (
        <AuthContext.Provider value={{ token, state, email, login, logout, failLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("context must be used within an AuthProvider");
    }
    console.log(context);
    return context;
}