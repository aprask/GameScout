import { JSX, useState } from "react";
import { useParams } from "react-router-dom";
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

interface GameData {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  genres?: { name: string }[];
  first_release_date?: number;
  rating?: number;
}

function DynamicGame(): JSX.Element {
  const { id } = useParams();
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/igdb/${id}`);

        if (!response.ok) {
          console.log("aaaaaaahhhhh");
          throw new Error("Failed to fetch game details");
        }

        const data: GameData = await response.json();
        setGame(data);
        console.log(data);
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
          {game.cover && (
            <CardMedia
              component="img"
              sx={{
                width: { xs: "100%", md: "40%" },
                height: "auto",
                objectFit: "cover",
              }}
              image={game.cover.url.replace("t_thumb", "t_720p")}
              alt={game.name}
            />
          )}

          <CardContent sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {game.name}
            </Typography>
            {game.genres && (
              <Typography variant="subtitle1" gutterBottom>
                Genres: {game.genres.map((g) => g.name).join(", ")}
              </Typography>
            )}
            {game.first_release_date && (
              <Typography variant="subtitle2" color="text.secondary">
                Release Date:{" "}
                {new Date(game.first_release_date * 1000).toLocaleDateString()}
              </Typography>
            )}
            {game.rating && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                Rating: {game.rating.toFixed(1)}
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
          <Typography variant="h6">Reviews for {game.name}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default DynamicGame;
