import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0d0d0d",
        color: "#fff",
        borderTop: "1px solid #9400FF55",
        boxShadow: "0 -2px 10px #9400FF55",
        py: 2,
        textAlign: "center",
        mt: 6,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#ccc",
          textShadow: "0 0 5px #9400FF66",
        }}
      >
        © 2025 GameScout. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
