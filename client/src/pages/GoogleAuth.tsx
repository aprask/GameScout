import { useState } from "react";
import axios from "axios";
import FormContainer from "../components/auth/FormContainer";
import FormTitleHeader from "../components/login/TitleHeader";
import { Box, Button } from "@mui/material";

function GoogleAuth() {
    const [invalidLogin, setInvalidLogin] = useState(false);
    const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

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
        <>
            <FormContainer
              header={<FormTitleHeader />}
              onSubmit={(e) => { e.preventDefault(); }}
            >
                {invalidLogin && (
                    <Box sx={{ color: 'red', mb: 2 }}>
                        Failed to initiate Google Login. Please try again.
                    </Box>
                )}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGoogleLogin}
                    sx={{ mt: 2 }}
                >
                    Continue with Google
                </Button>
            </FormContainer>
        </>
    );
}

export default GoogleAuth;
