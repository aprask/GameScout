import { Container, Typography, Box } from '@mui/material';
import BanUserForm from '../components/admin/BanUserForm';
import UnbanUserForm from '../components/admin/UnbanUserForm';

function AdminPage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                    Admin Dashboard
                </Typography>
                <Box sx={{ mb: 4, width: '100%' }}>
                    <BanUserForm />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <UnbanUserForm />
                </Box>
            </Box>
        </Container>
    );
}

export default AdminPage;
