import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline,
    Grid2,
    Modal,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type FollowingUser = {
    id: string,
    picture: string,
    name: string
}

export default function Following({id}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [followers, setFollowers] = useState<FollowingUser[]>([]);

    const baseUrl = import.meta.env.VITE_APP_ENV === "production"
        ? import.meta.env.VITE_PROD_URL
        : import.meta.env.VITE_DEV_URL;

    useEffect(() => {

    }, [id]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
    <>
    </>
    );
}
