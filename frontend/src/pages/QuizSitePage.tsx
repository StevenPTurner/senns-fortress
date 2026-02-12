import React, { useEffect } from "react";
import QuizListItem from "../components/lists/QuizListItem";
import SiteList from "../components/lists/SiteList";
import Site from "../types/Site.types";
import { mockQuizSites } from "../mock/mockData";

export default function QuizSitePage() {
    const [quizSites, setQuizSites] = React.useState<Site[]>([]);

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            setQuizSites(mockQuizSites);
        } else {
            fetch("/api/list/quiz")
                .then(response => response.json())
                .then((data) => setQuizSites(data))
                .catch((error) => console.error(error));
        }
    }, []);

    return <SiteList>
        {quizSites.map(site => (
            <QuizListItem
                key={site.name}
                quizSite={site}
            />
        ))}
    </SiteList>
}
