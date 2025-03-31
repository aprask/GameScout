import {
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  ImageList,
  ImageListItem,
  Typography,
  useTheme,
} from "@mui/material";
import image from "../../assets/image.png";

function Dashboard() {
  const theme = useTheme();

  const arrOfLen5: number[] = [0, 1, 2, 3, 4];

  return (
    <>
      <CssBaseline />
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Gamescout
        </Typography>
        <Typography variant="body1" gutterBottom>
          Discover and track your favorite games with ease.
        </Typography>
        <Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
            <Card sx={{ m: 5, ml: 2 }}>
              <CardContent sx={{ textAlign: "left" }}>
                <Typography sx={{ ml: 3 }} variant="h5">
                  Top Games
                </Typography>
                <ImageList
                  cols={5}
                  rowHeight={180}
                  gap={15}
                  sx={{ width: "1fr", ml: 0.5, mr: 0.5 }}
                >
                  {arrOfLen5.map((num) => (
                    <ImageListItem key={num}>
                      <img
                        src={image}
                        alt="Game Image"
                        style={{ borderRadius: "8px" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </CardContent>
            </Card>
            <Card sx={{ m: 5, ml: 2 }}>
              <CardContent>
                <Typography variant="h5">Profile</Typography>
              </CardContent>
            </Card>
          </Box>
          <Card sx={{ m: 5 }}>
            <CardContent>
              <Typography variant="h5">Articles</Typography>
            </CardContent>
          </Card>
          <Card sx={{ m: 5 }}>
            <CardContent>
              <Typography variant="h5">About Us</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
