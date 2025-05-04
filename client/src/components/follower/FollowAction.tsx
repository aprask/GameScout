import { Button } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";


const baseUrl =
import.meta.env.VITE_APP_ENV === "production"
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_DEV_URL;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const FollowAction = ({ id }: {id: string}) => {
    const { userId } = useAuth();
    const [isTarget, setIsTarget] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(`ID: ${id}`);
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
                console.log(`Status: ${res.data.status}`)
                const isAFollower = res.data.status;
                console.log(`Is following/a follower: ${isAFollower}`);
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
        console.log(`Follower: ${userId}`);
        console.log(`Target: ${id}`);
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
                await delay(1000);
                res = await axios.get(
                    `${baseUrl}/api/v1/follow/verify/${id}/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                console.log(`Status: ${res.data.status}`)
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
                await delay(1000);
                res = await axios.get(
                    `${baseUrl}/api/v1/follow/verify/${id}/${userId}`,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (res.status !== 200) return;
                console.log(`Status: ${res.data.status}`)
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
                >
                    {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </>
    );
    
};

export default FollowAction;
