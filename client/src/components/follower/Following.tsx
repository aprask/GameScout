import {
    Box,
    Button,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type FollowingUser = {
    id: string;
    picture: string;
    name: string;
};


export default function Following({id}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [followers, setFollowers] = useState<FollowingUser[]>([]);

    const baseUrl =
        import.meta.env.VITE_APP_ENV === "production"
            ? import.meta.env.VITE_PROD_URL
            : import.meta.env.VITE_DEV_URL;

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${baseUrl}/api/v1/follow/user/following/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (res.status === 200 && res.data.following_users) {
                    const followingUsers: FollowingUser[] = [];
                    for (let i = 0; i < res.data.following_users.length; i++) {
                        followingUsers.push({
                            id: res.data.following_users[i].user_id,
                            picture: res.data.following_users[i].profile_img,
                            name: res.data.following_users[i].profile_name
                        })
                    }
                    setFollowers(followingUsers);
                } else {
                    setError("Failed to fetch following users");
                }
            } catch (err) {
                console.error(`Encountered an error: ${err}`);
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchFollowingUsers();
    }, [id]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleProfileClick = (userId: string) => {
        handleClose();
        navigate(`/profile/${userId}`);
    };

    return (
        <>
            <Button onClick={handleOpen} variant="outlined">
                View Following
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Following List
                    </Typography>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <ImageList cols={3} gap={12}>
                            {followers.map((user) => (
                                <Tooltip key={user.id} title={user.name} arrow>
                                    <ImageListItem
                                        onClick={() => handleProfileClick(user.id)}
                                        sx={{
                                            cursor: "pointer",
                                            transition: "transform 0.2s",
                                            '&:hover': {
                                                transform: "scale(1.05)",
                                            },
                                        }}
                                    >
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            loading="lazy"
                                            style={{ borderRadius: 8 }}
                                        />
                                        <ImageListItemBar
                                            title={user.name}
                                            position="below"
                                            sx={{ textAlign: "center" }}
                                        />
                                    </ImageListItem>
                                </Tooltip>
                            ))}
                        </ImageList>
                    )}
                </Box>
            </Modal>
        </>
    );
}
