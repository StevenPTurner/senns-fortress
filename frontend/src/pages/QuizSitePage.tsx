import React, { useEffect } from "react";
import QuizListItem from "../components/lists/QuizListItem";
import SiteList from "../components/lists/SiteList";
import QuizSite from "../types/QuizSite.types";
import { mockQuizSites } from "../mock/mockData";
import { useAuth } from "../auth/AuthContext";
import env from "../lib/EnvReader";
import LoadingList from "../components/lists/LoadingList/LoadingList";

export default function QuizSitePage() {
    const [quizSites, setQuizSites] = React.useState<QuizSite[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const { token } = useAuth();

    useEffect(() => {
        setLoading(true);
        if (env.get('DATA_MODE') === 'LOCAL') {
            setQuizSites(mockQuizSites);
            setLoading(false);
        } else {
            const baseUrl = env.get('API_BASE');
            fetch(`${baseUrl}/list/quiz`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data) => setQuizSites(data))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }
    }, []);

    return loading ? (
        <LoadingList />
    ) : (
        <SiteList>
            {quizSites.map(site => (
                <QuizListItem
                    key={site.name}
                    quizSite={site}
                />
            ))}
        </SiteList>
    );
}
