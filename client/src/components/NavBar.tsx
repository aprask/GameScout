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
} from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { useProfile } from "../context/profile/ProfileContext";

function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { profileImage } = useProfile();
  const { profileId } = useAuth();

  const handleLogout = async () => {
    await logout();
    toggleDrawer();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#0d0d0d",
          borderBottom: "1px solid #9400FF55",
          boxShadow: "0 0 15px #9400FF88",
        }}
      >
        <Toolbar>
          {isAuthenticated && (
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={toggleDrawer}
              sx={{
                color: "#fff",
                "&:hover": {
                  color: "#9400FF",
                  transform: "scale(1.1)",
                },
              }}
              >
              <SportsEsportsIcon />
            </IconButton>
          )}
          <Typography 
              variant="h6" 
              noWrap
              sx={{
                flexGrow: 1,
                color: "#fff",
                textShadow: "0 0 10px #9400FFaa",
                fontWeight: "bold",
              }}                      
          >
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
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid #9400FF88",
                    boxShadow: "0 0 10px #9400FF66",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
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
          "& .MuiDrawer-paper": {
            backgroundColor: "#121212",
            borderRight: "1px solid #9400FF33",
            boxShadow: "0 0 15px #9400FF88",
            width: 250,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {[
              { to: "/", label: "Dashboard" },
              { to: "/community", label: "Community" },
              { to: "/search", label: "Games" },
              ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={toggleDrawer}
              >
                <ListItemButton
                  sx={{
                    color: "#fff",
                    borderBottom: "1px solid #9400FF22",
                    "&:hover": {
                      backgroundColor: "#1a1a1a",
                      boxShadow: "inset 0 0 10px #9400FF44",
                    },
                  }}
                >
                  {item.label}
                </ListItemButton>
              </NavLink>
            ))}
            <NavLink
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleLogout}
            >
              <ListItemButton
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1a1a1a",
                    boxShadow: "inset 0 0 10px #9400FF44",
                  },
                }}
              >
                Logout
              </ListItemButton>
            </NavLink>
          </List>
        </Box>
      </Drawer>
      )}

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
