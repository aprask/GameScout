import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";

function NavBar() {
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                <SportsEsportsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Gamescout
                </Typography>
                    <Button color="inherit">Dashboard</Button>
                    <Button color="inherit">Community</Button>
                    <Button color="inherit">Games</Button>
                    <Button color="inherit">Profile</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar;