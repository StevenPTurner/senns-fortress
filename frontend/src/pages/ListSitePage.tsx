import SiteList from "../components/lists/SiteList";
import ListListItem from '../components/lists/SiteListItem';
import ConfigPanel from "../components/ConfigPanel";
import { useAuth } from "../auth/AuthContext";
import ListSite from "../types/ListSite.types";
import LoadingList from "../components/lists/LoadingList/LoadingList";
import { useListSites } from "../hooks/useListSites";
import { useState } from "react";

export default function ListSitePage() {
    const { token } = useAuth();
    const { data: listSites, loading } = useListSites(token!);
    const [hideLowQuality, setHideLowQuality] = useState(true);

    const filterLowQuality = (site: ListSite) => {
        return !(site.lowQuality && hideLowQuality);
    };

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
