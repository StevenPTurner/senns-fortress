import { useEffect } from "react";
import { CredentialResponse } from "@react-oauth/google";
import LoadingSpinner from "../components/LoadingSpinner";
import env from "../lib/EnvReader";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";

declare const google: any;

export default function LoginPage() {
    const { authenticate, loading } = useGoogleSignIn();

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: env.get('CLIENT_ID'),
            callback: (response: CredentialResponse) => authenticate(response.credential!)
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
        );
    }, []);

    return loading ? (
        <LoadingSpinner text='Logging in...' color='white' />
    ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div id="buttonDiv"></div>
        </div>
    );
}