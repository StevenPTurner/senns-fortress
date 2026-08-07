import React, { useEffect } from "react";
import SiteList from "../components/lists/SiteList";
import ListListItem from '../components/lists/SiteListItem';
import Site from "../types/Site.types";
import { mockListSites } from "../mock/mockData";
import ConfigPanel from "../components/ConfigPanel";
import { useAuth } from "../auth/AuthContext";
import env from "../lib/EnvReader";

export default function ListSitePage() {
    const [listSites, setListSites] = React.useState<Site[]>([]);
    const [hideLowQuality, setHideLowQuality] = React.useState(true);
    const { token } = useAuth();

    const filterLowQuality = (site: Site) => {
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
