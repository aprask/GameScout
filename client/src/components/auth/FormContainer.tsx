import React from 'react';
import { Container, Box, Paper } from '@mui/material';

interface SignUpFormContainerProps {
    header: React.ReactNode;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

function SignUpFormContainer(props: SignUpFormContainerProps) {
  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {props.header}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '40%',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            component="form"
            onSubmit={props.onSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {props.children}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default SignUpFormContainer;
