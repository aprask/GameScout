import React from 'react';
import { TextField } from '@mui/material';

interface PasswordInputProps {
  value: string;
  error: boolean;
  errorMessage: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


function PasswordInput(props: PasswordInputProps) {
  return (
    <TextField
      fullWidth
      name="password"
      label="Password"
      type="password"
      value={props.value}
      onChange={props.onChange}
      color={props.error ? 'error' : 'primary'}
      helperText={props.errorMessage}
      variant="outlined"
      margin="normal"
      required
    />
  );
}

export default PasswordInput;
