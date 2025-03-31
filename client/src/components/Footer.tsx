import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        textAlign: "center",
      }}
    >
      <Typography variant="body2">Copyright &copy; GameScout 2025</Typography>
    </Box>
  );
}

export default Footer;
