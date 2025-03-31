import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemText,
  IconButton,
  CssBaseline,
  Box,
  ListItemButton,
  Avatar,
  useTheme,
} from "@mui/material";
import { useState } from "react";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <SportsEsportsIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Gamescout
          </Typography>
          <Avatar alt="Profile Pic" src="" />
        </Toolbar>
      </AppBar>

      <Drawer
        //variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {["Dashboard", "Community", "Games", "Profile", "Articles"].map(
              (text) => (
                <ListItemButton key={text}>
                  <ListItemText primary={text} />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}

export default NavBar;
