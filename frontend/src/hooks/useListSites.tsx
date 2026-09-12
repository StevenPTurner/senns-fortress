import { useEffect, useState } from "react";
import ListSite from "../types/ListSite.types";
import { getListSites } from "../api/List";

export function useListSites(token: string) {
    const [data, setData] = useState<ListSite[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await getListSites(token);
                setData(response);
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