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

interface ProfileData {
  profileName: string | null;
  profileImage: string | null;
  profileId: string | null;
}

function DashboardPage(): JSX.Element {
  const [newGames, setNewGames] = useState<GameData[] | null>();
  const [newArticles, setNewArticles] = useState<ArticleData[] | null>();
  const [featuredCreator, setFeaturedCreator] = useState<ProfileData | null>();
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
        const featuredCreator = await axios.get(
          `${baseUrl}/api/v1/users/featured/creator`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (featuredCreator.status === 200) {
          setFeaturedCreator({
            profileName: featuredCreator.data.user.profile_name,
            profileImage: featuredCreator.data.user.profile_img,
            profileId: featuredCreator.data.user.profile_id
          });
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
      <Container   sx={{
        textAlign: "center",
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        py: 8,
        border: "2px solid #9400FF33",
        boxShadow: "0 0 20px #9400FF55",
      }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "#FFFFFF",
            textShadow: "0 0 10px #9400FFaa",
          }}
        >
          Welcome to Gamescout
        </Typography>
        <Typography variant="body1" gutterBottom
          sx={{
            color: "#FFFFFF",
            textShadow: "0 0 10px #9400FFaa",
          }}
        >
          Discover and track your favorite games with ease.
        </Typography>
        <Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
            <Card sx={{
              m: 5,
              background: "linear-gradient(145deg, #1a1a1a, #121212)",
              border: "1px solid #9400FF66",
              borderRadius: "8px",
              boxShadow: "0 0 12px #9400FF44",
              color: "#f0f0f0",
            }}>
              <CardContent sx={{ textAlign: "left" }}>
                <Typography variant="h5"
                sx={{
                  color: "#FFFFFF",
                  textShadow: "0 0 10px #9400FFaa",
                  ml: 3, 
                  mt: 1
                }}
                >
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
                          style={{
                            borderRadius: "6px",
                            height: "50%",
                            boxShadow: "0 0 10px #9400FF77",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                          }}                      
                          onClick={() => navigate(`/game?id=${game.game_id}`)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
                {!newGames && <Typography>Error Fethcing Games</Typography>}
              </CardContent>
            </Card>
            <Card
              sx={{
                m: 5,
                background: "linear-gradient(145deg, #1a1a1a, #121212)",
                border: "1px solid #9400FF66",
                borderRadius: "8px",
                boxShadow: "0 0 12px #9400FF44",
                color: "#f0f0f0",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    textShadow: "0 0 10px #9400FFaa",
                    mb: 2,
                  }}
                  variant="h5"
                >
                  Featured Creator
                </Typography>

                {featuredCreator ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={featuredCreator.profileImage || undefined}
                      alt={featuredCreator.profileName || "Creator"}
                      onClick={() => navigate(`/profile/${featuredCreator.profileId}`)}
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: "2px solid #9400FF",
                        boxShadow: "0 0 12px #9400FF88",
                        cursor: "pointer",
                        mb: 2,
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 0 16px #9400FFcc",
                        },
                        transition: "0.3s ease",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#ffffff",
                        textShadow: "0 0 6px #9400FFaa",
                      }}
                    >
                      {featuredCreator.profileName}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No featured creator at the moment.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
          <Card 
            sx={{
              m: 5,
              background: "linear-gradient(145deg, #1a1a1a, #121212)",
              border: "1px solid #9400FF66",
              borderRadius: "8px",
              boxShadow: "0 0 12px #9400FF44",
              color: "#f0f0f0",
            }}
          >
            <CardContent>
              <Typography variant="h5"
                sx={{
                  color: "#FFFFFF",
                  textShadow: "0 0 10px #9400FFaa",
                  ml: 3, 
                  mt: 1
                }}
              >Latest Articles</Typography>

              {newArticles && (
                <Box>
                  {newArticles!.map((article) => (
                    <Paper
                      key={article.article_id}
                      elevation={3}
                      sx={{
                        m: 1,
                        p: 2,
                        background: "#1a1a1a",
                        border: "1px solid #9400FF55",
                        boxShadow: "0 0 10px #9400FF33",
                        color: "#f0f0f0",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#2a2a2a",
                          boxShadow: "0 0 15px #9400FF88",
                        },
                      }}                    
                      onClick={() =>
                        navigate(`/community/article?id=${article.article_id}`)
                      }
                    >
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          textShadow: "0 0 10px #9400FFaa",
                          ml: 3, 
                          mt: 1
                        }}
                      >{article.article_title}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
              {!newArticles && <Typography>No articles to display</Typography>}
            </CardContent>
          </Card>

          <Card sx={{
            m: 5,
            background: "linear-gradient(145deg, #1a1a1a, #121212)",
            border: "1px solid #9400FF66",
            borderRadius: "8px",
            boxShadow: "0 0 12px #9400FF44",
            color: "#f0f0f0",
          }}>
            <CardContent>
              <Typography variant="h5"
                sx={{
                  color: "#FFFFFF",
                  textShadow: "0 0 10px #9400FFaa",
                  ml: 3, 
                  mt: 1,
                  mb: 2
                }}
              >About Us</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-around",
                  alignItems: "center",
                  gap: 4,
                  flexWrap: "wrap",
                  p: 2,
                  background: "#1a1a1a",
                  border: "1px solid #9400FF55",
                  boxShadow: "0 0 10px #9400FF33",
                  borderRadius: 2,
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
                      border: "2px solid #9400FF",
                      boxShadow: "0 0 10px #9400FF77",
                    }}
                  />
                  <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        textShadow: "0 0 10px #9400FFaa",
                        ml: 3, 
                        mt: 1
                      }}
                    >Andrew Praskala</Typography>
                    <Typography variant="body1"
                      sx={{
                        color: "#FFFFFF",
                        textShadow: "0 0 10px #9400FFaa",
                        ml: 3, 
                        mt: 1
                      }}
                    >
                      Andrew Praskala, a senior undergraduate computer science
                      student at UNC Charlotte. Andrew’s prior experience
                      included internships with Astro AI Trading and Wells
                      Fargo, as well as projects such as a Chip8 emulator and 
                      the UNCC Faculty Chatbot. Andrew has also contributed
                      to UNCC Hice's Edukona project.
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
                      border: "2px solid #9400FF",
                      boxShadow: "0 0 10px #9400FF77",
                    }}
                  />
                  <Paper elevation={3} sx={{ m: 2, p: 2 }}>
                    <Typography variant="h5"
                      sx={{
                        color: "#FFFFFF",
                        textShadow: "0 0 10px #9400FFaa",
                        ml: 3, 
                        mt: 1
                      }}
                    >Caleb Filip</Typography>
                  <Typography variant="body1"
                      sx={{
                        color: "#FFFFFF",
                        textShadow: "0 0 10px #9400FFaa",
                        ml: 3, 
                        mt: 1
                      }}
                    >
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
