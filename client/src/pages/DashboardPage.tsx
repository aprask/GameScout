import {
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Typography,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import caleb from "../../public/caleb.jpg";
import andrew from "../../public/andrew.jpg";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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

interface ArticleData {
  article_id: string;
  article_title: string;
  article_owner: string;
  article_content: string | null;
  created_at: Date;
  updated_at: Date;
}

function DashboardPage(): JSX.Element {
  const [newGames, setNewGames] = useState<GameData[] | null>();
  const [newArticles, setNewArticles] = useState<ArticleData[] | null>();
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
        const articleResponse = await axios.get(
          `${baseUrl}/api/v1/community/articles/new?n=3`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (articleResponse.status === 200) {
          setNewArticles(articleResponse.data.articles);
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
              <CardContent sx={{ textAlign: "left" }}>
                <Typography sx={{ ml: 3, mt: 1 }} variant="h5">
                  New Games
                </Typography>
                {newGames && (
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
                )}
                {!newGames && <Typography>Error Fethcing Games</Typography>}
              </CardContent>
            </Card>
            <Card sx={{ m: 5, ml: 2 }}>
              <CardContent>
                <Typography>Friends Activity</Typography>
              </CardContent>
            </Card>
          </Box>

          <Card sx={{ m: 5, mt: 0 }}>
            <CardContent>
              <Typography variant="h5">Newest Articles</Typography>

              {newArticles && (
                <Box>
                  {newArticles!.map((article) => (
                    <Paper
                      key={article.article_id}
                      elevation={3}
                      sx={{ m: 1, p: 1 }}
                      onClick={() =>
                        navigate(`/community/article?id=${article.article_id}`)
                      }
                    >
                      <Typography>{article.article_title}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
              {!newArticles && <Typography>No articles to display</Typography>}
            </CardContent>
          </Card>

          <Card sx={{ m: 5 }}>
            <CardContent>
              <Typography variant="h5">About Us</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={andrew}
                    alt="Andrew"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                  />
                  <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h5">Andrew Praskala</Typography>
                    <Typography variant="body1">
                      Andrew Praskala, a senior undergraduate computer science
                      student at UNC Charlotte. Andrew’s prior experience
                      included internships with Astro AI Trading and Wells
                      Fargo, as well as independent systems-level projects such
                      as a Chip8 emulator and the UNCC Faculty Chatbot.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        mt: 1,
                      }}
                    >
                      <IconButton
                        aria-label="GitHub"
                        href="https://github.com/aprask"
                      >
                        <GitHubIcon sx={{ fontSize: 45 }} />
                      </IconButton>
                      <IconButton
                        aria-label="LinkedIn"
                        href="https://www.linkedin.com/in/andrewpraskala/"
                      >
                        <LinkedInIcon sx={{ fontSize: 45 }} />
                      </IconButton>
                    </Box>
                  </Paper>
                </Box>
                <Box
                  sx={{
                    width: "50%",
                    height: "100%",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={caleb}
                    alt="Caleb"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                  />
                  <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h5">Caleb Filip</Typography>
                    <Typography variant="body1">
                      An undergraduate computer science student at UNC
                      Charlotte. Caleb has experience with data mining &
                      visualization, machine learning, and web development. His
                      projects include a machine learning image classifier and a
                      web application named RadiUS.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        mt: 1,
                      }}
                    >
                      <IconButton
                        aria-label="GitHub"
                        href="https://github.com/CalebFilip"
                      >
                        <GitHubIcon sx={{ fontSize: 45 }} />
                      </IconButton>
                      <IconButton
                        aria-label="LinkedIn"
                        href="https://www.linkedin.com/in/calebfilip/"
                      >
                        <LinkedInIcon sx={{ fontSize: 45 }} />
                      </IconButton>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default DashboardPage;
