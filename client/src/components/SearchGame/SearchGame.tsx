import { JSX } from "react";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import Image from "../../assets/image.png";

const fakeGames = Array.from({ length: 10000 }, (_, index) => ({
  game_id: (index + 1).toString(),
  game_name: `Game ${index + 1}`,
  game_art: Image,
  summary: `This is the summary for Game ${index + 1}.`,
  is_supported: index % 2 === 0,
  created_at: new Date(),
  updated_at: new Date(),
  realease_date: new Date(),
}));

function SearchGame(): JSX.Element {
  const [games, setGames] = useState(fakeGames);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 16;

  useEffect(() => {
    setGames(fakeGames);
  }, []);

  const filteredGames = games.filter((game) =>
    game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  // const handlePageChange = (
  //   value: number
  // ) => {
  //   setCurrentPage(value);
  // };

  return (
    <>
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
        <Grid container spacing={3} justifyContent="center">
          {currentGames.map((game) => (
            <Grid key={game.game_id}>
              <Card sx={{ width: 250 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={game.game_art}
                  alt={game.game_name}
                />
                <CardContent>
                  <Typography variant="h6" textAlign="center">
                    {game.game_name}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    {game.summary}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 3 }}>
          <Pagination
            count={Math.ceil(filteredGames.length / gamesPerPage)}
            page={currentPage}
            // onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </>
  );
}

export default SearchGame;
