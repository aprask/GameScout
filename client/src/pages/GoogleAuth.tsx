import { useState, useEffect } from "react";
import axios from "axios";
import FormContainer from "../components/auth/FormContainer";
import FormTitleHeader from "../components/login/TitleHeader";
import { Box, Button, Container, Typography } from "@mui/material";

const gameCovers: string[] = [];

const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
? `${import.meta.env.VITE_PROD_URL}`
: `${import.meta.env.VITE_DEV_URL}`;
const API_KEY = import.meta.env.VITE_API_MANAGEMENT_KEY

function GoogleAuth() {
    const [invalidLogin, setInvalidLogin] = useState(false);
    const [backgroundGameUrl, setBackgroundGameUrl] = useState("");

    useEffect(() => {
        const fetchCoverIds = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/game`, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `${API_KEY}`
                },
            });
            if (res.status === 200 && res.data.games.length > 0) {
                for (let i = 0; i < res.data.games.length; i++) gameCovers.push(res.data.games[i].cover_id);
                const randomCover = gameCovers[Math.floor(Math.random() * gameCovers.length)];
                setBackgroundGameUrl(`https://images.igdb.com/igdb/image/upload/t_1080p/${randomCover}.jpg`);    
            }
        }
        fetchCoverIds();
        }, []);

    async function handleGoogleLogin() {
        try {
            console.log(`URL: ${baseUrl}`);
            const res = await axios.post(`${baseUrl}/api/v1/auth/google-auth`, 
                {}, 
                {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(`Res Status: ${res}`);
            if (res.status === 200 && res.data.url) {
                window.location.href = res.data.url;
            } else {
                setInvalidLogin(true);
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            setInvalidLogin(true);
        }
    }

    return (
        <Box
        sx={{
            minHeight: "100vh",
            backgroundImage: backgroundGameUrl
              ? `linear-gradient(rgba(13,13,13,0.8), rgba(13,13,13,0.85)), url(${backgroundGameUrl})`
              : "none",
            backgroundColor: backgroundGameUrl ? "transparent" : "#0d0d0d",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Container maxWidth="xs">
            <FormContainer
              header={<FormTitleHeader />}
              onSubmit={(e) => e.preventDefault()}
            >
              {invalidLogin && (
                <Typography color="error" sx={{ mb: 2 }}>
                  Failed to initiate Google Login. Please try again.
                </Typography>
              )}
            <Button
            onClick={handleGoogleLogin}
            variant="contained"
            fullWidth
            sx={{
                mt: 2,
                fontSize: "1.1rem",
                fontWeight: 400,
                backgroundColor: "#9400FF",
                color: "#fff",
                boxShadow: "0 0 12px #9400FF88",
                borderRadius: "10px",
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                backgroundColor: "#7a00cc",
                boxShadow: "0 0 18px #9400FFcc",
                },
                "&:active": {
                transform: "scale(0.98)",
                boxShadow: "0 0 5px #9400FF",
                },
            }}
            >
                Continue with Google
              </Button>
            </FormContainer>
          </Container>
        </Box>
    );
}

export default GoogleAuth;
