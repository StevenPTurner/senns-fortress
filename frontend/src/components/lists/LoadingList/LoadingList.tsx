import SiteList from "../SiteList";
import Box from "@mui/material/Box";
import LoadingSpinner from "../../LoadingSpinner";
import LoadingListItem from "./LoadingListItem";


export default function LoadingList() {
    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10
                }}
            >
                <LoadingSpinner
                    text="Loading lists..."
                    color="white"
                />
            </Box>
            <SiteList>
                <LoadingListItem />
                <LoadingListItem />
                <LoadingListItem />
                <LoadingListItem />
            </SiteList>
        </>
    );
}
