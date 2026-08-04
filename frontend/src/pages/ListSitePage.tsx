import React, { useEffect } from "react";
import SiteList from "../components/lists/SiteList";
import ListListItem from '../components/lists/SiteListItem';
import Site from "../types/Site.types";
import { mockListSites } from "../mock/mockData";
import ConfigPanel from "../components/ConfigPanel";
import { useAuth } from "../auth/authContext";

export default function ListSitePage() {
    const [listSites, setListSites] = React.useState<Site[]>([]);
    const [hideLowQuality, setHideLowQuality] = React.useState(true);
    const { token } = useAuth();

    const filterLowQuality = (site: Site) => {
        return !(site.lowQuality && hideLowQuality);
    };

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            setListSites(mockListSites);
        } else {
            fetch("/api/list/site", {
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
