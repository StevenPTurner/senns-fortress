import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { authenticateWithGoogle } from "../api/Auth";
import env from "../lib/EnvReader";
import { jwtDecode } from "jwt-decode";
import TokenPayload from "../types/TokenPayload.types";

export function useGoogleSignIn() {
    const { login, failLogin } = useAuth();
    const [loading, setLoading] = useState(false);

    const authenticate = async (googleCredential: string) => {
        const authMode = env.get('AUTH_MODE');

        if (authMode === 'LOCAL') {
            return authenticateWithEmailInToken(googleCredential);
        }

        if (authMode === 'PROD') {
            return authenticateWithAuthService(googleCredential);
        }
        console.error(`Unknown Auth Moode: ${authMode}`);
        failLogin();
    };

    const authenticateWithAuthService = async (credential: string) => {
        try {
            setLoading(true);
            const authCredential = await authenticateWithGoogle(credential);
            login(authCredential);
        } catch (error) {
            failLogin();
            console.error(error);
            throw new Error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const authenticateWithEmailInToken = (credential: string) => {
        const decoded = jwtDecode<TokenPayload>(credential);
        const allowedEmails = env.get('EMAIL_WHITELIST')?.split(',') || [];
        if (allowedEmails.includes(decoded.email)) {
            login({
                token: credential,
                email: decoded.email,
                name: ''
            });
        } else {
            failLogin();
        }
    };
    return { authenticate, loading };
}