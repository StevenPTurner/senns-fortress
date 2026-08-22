import Skeleton from "@mui/material/Skeleton";

export default function LoadingListItem() {
    return <Skeleton
        variant="rectangular"
        height={45}
        animation='pulse'
        sx={{
            bgcolor: '#d0d0d0',
            pt: 2,
            pb: 2
        }}
    />
}