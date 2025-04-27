import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  IconButton,
  CssBaseline,
  Box,
  ListItemButton,
  Avatar,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/auth/AuthContext';
import { useProfile } from "../context/profile/ProfileContext";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, logout, isAdmin } = useAuth()
  const { profileImage } = useProfile();
  const { profileId } = useAuth();

  const handleLogout = async () => {
    await logout();
    toggleDrawer();
  };
  
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
          {isAuthenticated && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <SportsEsportsIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Gamescout
          </Typography>
          {isAuthenticated && (
            <Box sx={{ width: 100 }}>
            <NavLink
                to={`/profile/${profileId}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <Avatar 
                    alt="Profile Pic" 
                    src={profileImage || undefined}
                    sx={{ width: 40, height: 40 }}
                />
            </NavLink>            
          </Box>
          )}
        </Toolbar>
      </AppBar>

      {isAuthenticated && (
        <Drawer
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
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemButton>Dashboard</ListItemButton>
            </NavLink>
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemButton>Community</ListItemButton>
            </NavLink>
            <NavLink
              to="/search"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemButton>Games</ListItemButton>
            </NavLink>
            {isAdmin && <NavLink
              to="/admin"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemButton>Admin</ListItemButton>
            </NavLink>}
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemButton>Articles</ListItemButton>
            </NavLink>
            <NavLink
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleLogout}
            >
              <ListItemButton>Logout</ListItemButton>
            </NavLink>
          </List>
        </Box>
      </Drawer> )}

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
