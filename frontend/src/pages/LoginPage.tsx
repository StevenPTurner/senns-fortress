import { CredentialResponse } from "@react-oauth/google";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { jwtDecode } from "jwt-decode";
import TokenPayload from "../types/TokenPayload.types";
import env from "../lib/EnvReader";

declare const google: any;

export default function LoginPage() {
    const { login, failLogin } = useAuth();

    const handleCredentialResponse = (credentialResponse: CredentialResponse) => {
        const authMode = env.get('AUTH_MODE');
        if (authMode === 'LOCAL') {
            checkEmailsFromToken(credentialResponse);
        } else if (authMode === 'PROD') {
            callAuthService(credentialResponse);
        }
    };

    const checkEmailsFromToken = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            const decoded = jwtDecode<TokenPayload>(credentialResponse.credential);
            const allowedEmails = env.get('EMAIL_WHITELIST')?.split(',') || [];
            if (allowedEmails.includes(decoded.email)) {
                login({
                    token: credentialResponse.credential,
                    email: decoded.email
                });
            } else {
                failLogin();
            }
        }

    }

    const callAuthService = (credentialResponse: CredentialResponse) => {
         fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                token: credentialResponse.credential 
            })
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('Login failed');
                throw new Error('Login failed');
            }
        })
        .then((data) => login({token: data.token,email: data.email}))
        .catch((error) => console.log(error));
    }
 
    

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: env.get('CLIENT_ID'),
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
        );
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div id="buttonDiv"></div>
        </div>
    );
}