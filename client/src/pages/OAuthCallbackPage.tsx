import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useProfile } from "../context/profile/ProfileContext";
import axios from "axios";
import { Box, CircularProgress, Typography } from "@mui/material";

interface loginResp {
  email: string;
  user_id: string;
  profile_id: string;
  isAdmin: boolean;
  admin_id: string;
}

interface profileResp {
  profile_name: string;
  profile_image: string;
}

export default function OAuthCallbackPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { setProfileName, setProfileImage } = useProfile();
    const [loading, setLoading] = useState(true);
    
    const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

    async function updateProfileState(data: profileResp) {
      await setProfileName(data.profile_name);
      await setProfileImage(data.profile_image);
    }

    async function updateAuthState(data: loginResp) {
      await login(
        data.email,
        data.user_id,
        data.profile_id,
        data.isAdmin,
        data.admin_id,
      );
    }

    useEffect(() => {
      async function completeAuth() {
          try {
            const params = new URLSearchParams(location.search);
            const code = params.get('code'); // from google redirect, we get a code
            if (!code) {
                console.error("No authorization code found.");
                navigate('/login');
                return;
            }
            let res = await axios.get(
                `${baseUrl}/api/v1/auth/oauth?code=${code}`,
                {
                    withCredentials: true // we need to get the cookie from the server
                }
            ); // this code will be sent to our oauth endpoint in express, this gets us the cookie
            if (res.status !== 200) {
                console.error("Cannot authenticate");
                navigate('/login');
                return;
            }
            res = await axios.get(`${baseUrl}/api/v1/auth/me`, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status !== 200) {
                console.error("Cannot authenticate");
                navigate('/login');
                return;
            }
            console.log(res.data);
            const loginData: loginResp = {
                email: res.data.email,
                user_id: res.data.user_id,
                profile_id: res.data.profile_id,
                isAdmin: res.data.is_admin,
                admin_id: res.data.admin_id
            };
            const profileData: profileResp = {
                profile_name: res.data.username,
                profile_image: res.data.picture
            };
            await updateAuthState(loginData);
            await updateProfileState(profileData);
            setTimeout(() => {
                navigate('/');
            }, 1000);
          } catch (err) {
              console.error('Error fetching user info', err);
              navigate('/login');
          } finally {
              setLoading(false);
          }
      }
      completeAuth();
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            {loading ? (
                <>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Finishing your login...
                    </Typography>
                </>
            ) : (
                <Typography variant="h6">
                    Redirecting...
                </Typography>
            )}
        </Box>
    );
}
