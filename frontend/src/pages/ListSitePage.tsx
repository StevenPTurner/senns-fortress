import React, { useEffect } from "react";
import SiteList from "../components/lists/SiteList";
import ListListItem from '../components/lists/SiteListItem';
import { mockListSites } from "../mock/mockData";
import ConfigPanel from "../components/ConfigPanel";
import { useAuth } from "../auth/AuthContext";
import env from "../lib/EnvReader";
import ListSite from "../types/ListSite.types";

export default function ListSitePage() {
    const [listSites, setListSites] = React.useState<ListSite[]>([]);
    const [hideLowQuality, setHideLowQuality] = React.useState(true);
    const { token } = useAuth();

    const filterLowQuality = (site: ListSite) => {
        return !(site.lowQuality && hideLowQuality);
    };

    useEffect(() => {
        if (env.get('DATA_MODE') === 'LOCAL') {
            setListSites(mockListSites);
        } else {
            const baseUrl = env.get('API_BASE');
            fetch(`${baseUrl}/list/site`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data) => setListSites(data))
                .catch((error) => console.error(error));
        }
    }, []);

    return <>
        <ConfigPanel
            lowQualityListsHidden={hideLowQuality}
            onLowQualityCheckboxChange={setHideLowQuality} /><SiteList>
            {listSites.filter(filterLowQuality).map(site => (
                <ListListItem
                    key={site.name}
                    listSite={site}
                />
            ))}
        </SiteList>
    </>
}
