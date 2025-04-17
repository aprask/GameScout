import { Avatar, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const FormTitleHeader = () => (
  <>
    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
      Create Account
    </Typography>
  </>
);

export default FormTitleHeader;