import { Typography, Container } from "@mui/material";
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Gamescout
        </Typography>
        <Typography variant="body1">
          Discover and track your favorite games with ease.
        </Typography>
      </Container>
    </>
  );
}

export default App;