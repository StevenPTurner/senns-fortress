import QuizListItem from "../components/lists/QuizListItem";
import SiteList from "../components/lists/SiteList";
import { useAuth } from "../auth/AuthContext";
import LoadingList from "../components/lists/LoadingList/LoadingList";
import { useQuizSites } from "../hooks/useQuizSites";

export default function QuizSitePage() {
    const { token } = useAuth();
    const { data: quizSites, loading } = useQuizSites(token!);

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
