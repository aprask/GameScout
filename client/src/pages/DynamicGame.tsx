import { JSX, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

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

function DynamicGame(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [game, setGame] = useState<GameData | null>(null);
  const [gameImage, setGameImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/game/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
          },
        });
        if (res.status === 200) {
          setGame(res.data.game);

          const image_id = res.data.game.game_art;
          console.log(image_id);
          const image_res = await axios.get(
            `http://localhost:3000/api/v1/image/${image_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
              },
            }
          );
          if (image_res.status === 200) {
            console.log(image_res.data.image);

            const blob = new Blob([image_res.data.image_data], {
              type: "image/png",
            });
            if (blob) {
              console.log(blob);
              const imageURL = URL.createObjectURL(blob);
              console.log(`url: ${imageURL}`);
              setGameImage(imageURL);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!game) {
    return (
      <Container>
        <Typography variant="h4">Game not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          <CardMedia
            component="img"
            image={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover_id}.jpg`}
            alt={`${game.game_name} cover`}
            sx={{ maxWidth: { xs: "100%", md: 300 }, margin: "auto" }}
          />
          <CardContent sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {game.game_name}
            </Typography>
            {game.release_date && (
              <Typography variant="subtitle2" color="text.secondary">
                Release Date: {new Date(game.release_date).toLocaleDateString()}
              </Typography>
            )}

            {game.summary && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {game.summary}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Reviews for {game.game_name}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default DynamicGame;
