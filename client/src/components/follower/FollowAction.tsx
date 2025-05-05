import { Button } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";


const baseUrl =
import.meta.env.VITE_APP_ENV === "production"
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_DEV_URL;


const FollowAction = ({ id }: {id: string}) => {
    const { userId } = useAuth();
    const [isTarget, setIsTarget] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        const checkFollowing = async () => {
            if (userId === id) {
                setIsTarget(true);
                return;
            };
            try {
                const res = await axios.get(
                    `${baseUrl}/api/v1/follow/verify/${id}/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                const isAFollower = res.data.status;
                setIsFollowing(isAFollower);
            } catch (err) {
                console.error(`Error checking follow status: ${err}`);
            }
        };
        checkFollowing();
    }, [userId, id]);

    const handleToggleFollow = async () => {
        if (!userId || userId === id) {
            setIsTarget(true);
            return;
        }
        setLoading(true);
        try {
            if (isFollowing) {
                let res = await axios.delete(
                    `${baseUrl}/api/v1/follow/following/${id}/follower/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                res = await axios.get(
                    `${baseUrl}/api/v1/follow/verify/${id}/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                setIsFollowing(res.data.status);
            } else {
                let res = await axios.post(
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
                res = await axios.get(
                    `${baseUrl}/api/v1/follow/verify/${id}/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                setIsFollowing(res.data.status);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {!isTarget && (
                <Button 
                    variant={isFollowing ? "outlined" : "contained"}
                    color="primary"
                    onClick={handleToggleFollow}
                    disabled={loading}
                    sx={{
                        borderColor: "#9400FF",
                        color: "#9400FF",
                        borderRadius: 0,
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        boxShadow: "0 0 6px #9400FF88",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#9400FF33",
                          boxShadow: "0 0 12px #9400FF",
                        },
                      }}                    
                >
                    {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </>
    );
    
};

export default FollowAction;
