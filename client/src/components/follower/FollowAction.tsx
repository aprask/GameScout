import { Button } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";

interface FollowButtonProps {
    id: string;
    onToggle?: (isNowFollowing: boolean) => void;
}

const FollowAction = ({ id, onToggle }: FollowButtonProps) => {
    const { userId, profileId } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const baseUrl =
        import.meta.env.VITE_APP_ENV === "production"
            ? import.meta.env.VITE_PROD_URL
            : import.meta.env.VITE_DEV_URL;

    useEffect(() => {
        const checkFollowing = async () => {
            if (!profileId || profileId === id) return;
            try {
                const res = await axios.get(
                    `${baseUrl}/api/v1/follow/user/followers/${id}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                let isAFollower = false;
                for (let i = 0; i < res.data.followers.length; i++) {
                    if (res.data.followers[i].profile_id === profileId) isAFollower = true;
                }
                if (isAFollower) setIsFollowing(true);
            } catch (err) {
                console.error("Error checking follow status:", err);
            }
        };
        checkFollowing();
    }, [userId, id]);

    const handleToggleFollow = async () => {
        if (!userId || userId === id) return;
        setLoading(true);
        try {
            if (isFollowing) {
                await axios.delete(
                    `${baseUrl}/api/v1/follow/following/${id}/follower/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                setIsFollowing(false);
                onToggle?.(false);
            } else {
                await axios.post(
                    `${baseUrl}/api/v1/follow`,
                    {
                        "user_id_following": `${id}`,
                        "user_id_follower": `${userId}`,
                        "status": "Active"
                    },
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                setIsFollowing(true);
                onToggle?.(true);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!profileId || profileId === id) return null;

    return (
        <Button 
            variant={isFollowing ? "outlined" : "contained"}
            color="primary"
            onClick={handleToggleFollow}
            disabled={loading}
        >
            {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
};

export default FollowAction;
