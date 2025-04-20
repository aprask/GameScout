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
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/anon.png");
  const { isAuthenticated, profileId, token, logout } = useAuth()

  const handleLogout = () => {
    logout();
    toggleDrawer();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfileImg = async() => {
      try {
        let res = await axios.get(
          `/api/v1/profile/${profileId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
        );
        res = await axios.get(
            `/api/v1/image/${res.data.profile.profile_img}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            }
          );
          const blob = new Blob([res.data.image.image_data.data], { type: 'image/png' });
          if (blob) {
            const imageURL = URL.createObjectURL(blob);
            setProfileImage(imageURL);
          }
      } catch (err) {
        console.error("Error fetching profile image:", err)
      }
    }
    fetchProfileImg();
  }, [])

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
                to="/profile"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Avatar 
                  alt="Profile Pic" 
                  src={profileImage}
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
