import React, { createContext, useState } from "react";
import env from "../lib/EnvReader";

interface AuthState {
    token: string | null;
    state: 'LOGGED_IN' | 'NOT_LOGGED_IN' | 'FAILED_LOGIN';
    email: string | null;
    login: (authState: {token: string, email: string}) => void;
    logout: () => void;
    failLogin: () => void;
    showLoginNotification: boolean;
    setShowLoginNotification: (show: boolean) => void;
}
const debug = env.isEnabled('DEBUG_LOG');
const authMode = env.get('AUTH_MODE');

const AuthContext = createContext<AuthState | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return sessionStorage.getItem('loginToken');
    });
    const [state, setState] = useState<'LOGGED_IN' | 'NOT_LOGGED_IN' | 'FAILED_LOGIN'>(() => {
        if (authMode === 'SKIP') {
            return 'LOGGED_IN';
        }
        return token ? 'LOGGED_IN' : 'NOT_LOGGED_IN';
    });
    const [email, setEmail] = useState<string | null>(null);
    const [showLoginNotification, setShowLoginNotification] = useState(false);

    const login = (authState: {token: string, email: string}) => {
        setState('LOGGED_IN');
        setToken(authState.token);
        setEmail(authState.email);
        sessionStorage.setItem('loginToken', authState.token);
        setShowLoginNotification(true);
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
        <AuthContext.Provider value={{ token, state, email, login, logout, failLogin, showLoginNotification, setShowLoginNotification }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("context must be used within an AuthProvider");
    }
    if (debug) {
        console.log(context);
    }
    return context;
}