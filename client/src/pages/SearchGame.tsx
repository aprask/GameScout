import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Box,
  Pagination,
  CircularProgress,
} from "@mui/material";

type Game = {
  game_id: string;
  game_name: string;
  cover_id: string;
  summary: string;
  is_supported: boolean;
  created_at: string;
  updated_at: string;
  realease_date: string;
};

type PaginatedGameResponse = {
  current_page: number;
  limit: number;
  items: number;
  pages: number;
  data: Game[];
};

function SearchGame(): JSX.Element {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

  const GAMES_PER_PAGE = 16;
  const SORT_TYPE = "new";

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ games: PaginatedGameResponse }>(
          `${baseUrl}/api/v1/game/list`,
          {
            params: {
              lim: GAMES_PER_PAGE,
              page: currentPage,
              sort: SORT_TYPE,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: import.meta.env.VITE_API_MANAGEMENT_KEY,
            },
          }
        );

        setGames(response.data.games.data);
        setTotalPages(response.data.games.pages);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentPage]);

  const filteredGames = games.filter((game) =>
    game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Search Games
      </Typography>

      <Box component="form" sx={{ m: 4 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center">
            {filteredGames.map((game) => (
              <Grid key={game.game_id}>
                <Card
                  sx={{
                    width: 250,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                  onClick={() => navigate(`/game?id=${game.game_id}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: "auto",
                      maxHeight: 140,
                      objectFit: "cover",
                    }}
                    src={`https://images.igdb.com/igdb/image/upload/t_720p/${game.cover_id}.jpg`}
                    alt={game.game_name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {game.game_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default SearchGame;
