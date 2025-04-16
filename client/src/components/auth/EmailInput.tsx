import React from 'react';
import { TextField } from '@mui/material';

interface EmailInputProps {
  value: string;
  error: boolean;
  errorMessage: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function EmailInput(props: EmailInputProps) {
  return (
    <TextField
        fullWidth
        name="email"
        label="Email"
        type="email"
        value={props.value}
        onChange={props.onChange}
        color={props.error ? 'error' : 'primary'}
        helperText={props.errorMessage}
        variant="outlined"
        margin="normal"
        required
    />
  )
}

export default EmailInput;