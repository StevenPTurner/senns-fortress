import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import TokenPayload from "../types/TokenPayload.types";
import { useAuth } from "../auth/authContext";

declare const google: any;

export default function LoginPage() {
    const { login, failLogin } = useAuth();

    const handleSuccessLogin = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            const decoded = jwtDecode<TokenPayload>(credentialResponse.credential);
            const allowedEmails = import.meta.env.VITE_EMAIL_WHITELIST.split(',') || [];
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

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_CLIENT_ID,
            callback: handleSuccessLogin
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