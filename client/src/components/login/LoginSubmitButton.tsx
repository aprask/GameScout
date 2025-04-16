import React from 'react';
import { Button } from '@mui/material';


function LoginSubmitButton({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      onClick={onClick}
      sx={{
        mt: 2,
        py: 1.5,
        borderRadius: 2,
        fontSize: '1rem',
        textTransform: 'none'
      }}
    >
      Sign In
    </Button>
  );
}

export default LoginSubmitButton;
