import React, { useEffect } from "react";
import SiteList from "../components/lists/SiteList";
import ListListItem from '../components/lists/SiteListItem';
import { mockListSites } from "../mock/mockData";
import ConfigPanel from "../components/ConfigPanel";
import { useAuth } from "../auth/AuthContext";
import env from "../lib/EnvReader";
import ListSite from "../types/ListSite.types";
import LoadingList from "../components/lists/LoadingList";

export default function ListSitePage() {
    const [listSites, setListSites] = React.useState<ListSite[]>([]);
    const [hideLowQuality, setHideLowQuality] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const { token } = useAuth();

    const filterLowQuality = (site: ListSite) => {
        return !(site.lowQuality && hideLowQuality);
    };

    useEffect(() => {
        setLoading(true);
        if (env.get('DATA_MODE') === 'LOCAL') {
            setListSites(mockListSites);
            setLoading(false);
        } else {
            const baseUrl = env.get('API_BASE');
            fetch(`${baseUrl}/list/site`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data) => setListSites(data))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }
    }, []);

    return <>
        <ConfigPanel
            lowQualityListsHidden={hideLowQuality}
            onLowQualityCheckboxChange={setHideLowQuality}
            disabled={loading}
        />
        {loading ? (
            <LoadingList />
        ) : (
            <SiteList>
                {listSites.filter(filterLowQuality).map(site => (
                    <ListListItem
                        key={site.name}
                        listSite={site}
                    />
                ))}
            </SiteList>
        )
        }
    </>
}
