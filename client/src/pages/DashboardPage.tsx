import {
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  ImageList,
  ImageListItem,
  Typography,
  //useTheme,
} from "@mui/material";
import image from "../assets/image.png";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface GameData {
  created_at: Date;
  game_art: string;
  game_id: string;
  game_name: string;
  cover_id: string;
  is_supported: boolean;
  release_date: Date;
  summary: string;
  updated_at: Date;
}

function DashboardPage(): JSX.Element {
  const [newGames, setNewGames] = useState<GameData[] | null>();
  const navigate = useNavigate();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchNewestGamesAndArticles = async () => {
      try {
        const gameResponse = await axios.get(`${baseUrl}/api/v1/game/new?n=5`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (gameResponse.status === 200) {
          setNewGames(gameResponse.data.games);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchNewestGamesAndArticles();
  }, []);

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
            <Card sx={{ m: 5, mr: 1 }}>
              {newGames && (
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography sx={{ ml: 3, mt: 1 }} variant="h5">
                    New Games
                  </Typography>
                  <ImageList
                    cols={5}
                    rowHeight={180}
                    gap={15}
                    sx={{ width: "1fr", ml: 0.5, mr: 0.5 }}
                  >
                    {newGames!.map((game) => (
                      <ImageListItem key={game.game_id}>
                        <img
                          title={game.game_name}
                          src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover_id}.jpg`}
                          alt={game.game_name}
                          style={{ borderRadius: "8px", height: "50%" }}
                          onClick={() => navigate(`/game?id=${game.game_id}`)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </CardContent>
              )}
            </Card>
            <Card sx={{ m: 5, ml: 2 }}>
              <CardContent>
                <Typography variant="h5">Profile</Typography>
              </CardContent>
            </Card>
          </Box>
          <Card sx={{ m: 5, mt: 0 }}>
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

export default DashboardPage;
