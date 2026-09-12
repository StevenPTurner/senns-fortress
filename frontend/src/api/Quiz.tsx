import { mockQuizSites } from "../mock/mockData";
import env from "../lib/EnvReader";
import QuizSite from "../types/QuizSite.types";

export async function getQuizSites(token: string): Promise<QuizSite[]> {
    const baseUrl = env.get("API_BASE");
    const localMode = env.isLocalDataMode();

    if (localMode) {
        return Promise.resolve(mockQuizSites);
    }

    const response = await fetch(`${baseUrl}/list/quiz`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get quiz sites: ${response.status}`)
    }

    return response.json();
}