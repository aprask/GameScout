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

const witcher3: GameData = {
  id: 1,
  name: "The Witcher 3: Wild Hunt",
  summary:
    "The Witcher 3: Wild Hunt is a story-driven, open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
  cover: {
    url: "https://images.igdb.com/igdb/image/upload/t_thumb/co1wyy.jpg",
  },
  genres: [{ name: "RPG" }, { name: "Adventure" }],
  first_release_date: 1432147200, // May 20, 2015
  rating: 9.5,
};

function GameDetails(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameData | null>(witcher3);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchTokenAndData = async () => {
  //     try {
  //       const tokenRes = await axios.post(
  //         "https://id.twitch.tv/oauth2/token",
  //         null,
  //         {
  //           params: {
  //             client_id: import.meta.env.CLIENT_ID,
  //             client_secret: import.meta.env.CLIENT_SECRET,
  //             grant_type: "client_credentials",
  //           },
  //         }
  //       );

  //       const accessToken = tokenRes.data.access_token;

  //       const gameRes = await axios.post(
  //         "https://api.igdb.com/v4/games",
  //         `fields name,summary,cover.url,genres.name,first_release_date,rating; where id = ${id};`,
  //         {
  //           headers: {
  //             "Client-ID": import.meta.env.VITE_IGDB_CLIENT_ID,
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "text/plain",
  //           },
  //         }
  //       );

  //       if (gameRes.data.length > 0) {
  //         setGame(gameRes.data[0]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching game data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTokenAndData();
  // }, [id]);

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

export default GameDetails;
