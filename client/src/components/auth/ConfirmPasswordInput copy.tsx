import React from 'react';
import { TextField } from '@mui/material';

interface ConfirmPasswordInputProps {
  value: string;
  error: boolean;
  errorMessage: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ConfirmPasswordInput(props: ConfirmPasswordInputProps) {
  return (
    <TextField
        fullWidth
        name="confirmedPassword"
        label="Confirm Password"
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
export default ConfirmPasswordInput;
