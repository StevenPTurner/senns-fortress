import { useEffect, useState } from "react";
import { getQuizSites } from "../api/Quiz";
import QuizSite from "../types/QuizSite.types";

export function useQuizSites(token: string) {
    const [data, setData] = useState<QuizSite[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const result = await getQuizSites(token);
                setData(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);
    return { data, loading };
}
