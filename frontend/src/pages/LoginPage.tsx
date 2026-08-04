import { CredentialResponse } from "@react-oauth/google";
import { useEffect } from "react";
import { useAuth } from "../auth/authContext";

declare const google: any;

export default function LoginPage() {
    const { login } = useAuth();

    const handleCredentialResponse = (credentialResponse: CredentialResponse) => {
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
    };
        // if (credentialResponse.credential) {
        //     const decoded = jwtDecode<TokenPayload>(credentialResponse.credential);
        //     const allowedEmails = import.meta.env.VITE_EMAIL_WHITELIST.split(',') || [];
        //     if (allowedEmails.includes(decoded.email)) {
        //         login({
        //             token: credentialResponse.credential,
        //             email: decoded.email
        //         });
        //     } else {
        //         failLogin();
        //     }
        // }
    // }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_CLIENT_ID,
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