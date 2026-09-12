import env from "../lib/EnvReader";
import AuthCredential from "../types/AuthCredential.types";

export async function authenticateWithGoogle(googleToken: string): Promise<AuthCredential> {
    const baseUrl = env.get('API_BASE');

    const response = await fetch(`${baseUrl}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: googleToken
        })
    });

    if (!response.ok) {
        console.error(`Login Failed: ${response.status}`);
        throw new Error(`Login Failed: ${response.status}`);
    }

    return response.json();
}