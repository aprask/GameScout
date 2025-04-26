import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function UnbanUserForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isAdmin, adminId, token } = useAuth();
    const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;
        setError('');
        setSuccess('');

        try {
            console.log(`Admin ID: ${adminId}`);
            const res = await axios.patch(
                `${baseUrl}/api/v1/users/ban?ban_action=false`,
                {
                    "email": email,
                    "admin_id": adminId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
        
            if (res.status !== 200) {
                console.log("Failed to unban user");
                setError(`Failed to unban user: ${email}`);
            } else {
                console.log("Successfully unbanned user");
                setSuccess(`Successfully unbanned user: ${email}`);
                setEmail('');
            }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to ban user. Please try again.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Unban User
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{ mb: 2 }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                disabled={!email}
            >
                Unban User
            </Button>
        </Box>
    );
}

