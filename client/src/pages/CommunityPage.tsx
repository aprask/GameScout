import { JSX, useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Button,
  Modal,
  TextField,
  Fade,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/auth/AuthContext";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

interface Article {
  article_id: string;
  article_title: string;
  article_owner: string;
  article_content: string | null;
  created_at: Date;
  updated_at: Date;
}

function CommunityPage(): JSX.Element {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/community/articles`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setArticles(response.data.articles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" textAlign="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #9400FF55",
        boxShadow: "0 0 20px #9400FF55",
        borderRadius: "8px",
        py: 4,
        px: 4,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#fff",
          textShadow: "0 0 10px #9400FFaa",
          fontWeight: "bold",
        }}
        >
          Posts
        </Typography>
        <Box>
          <ArticleForm />
        </Box>
      </Box>
      {articles.length === 0 ? (
        <Typography sx={{ color: "#ccc", fontStyle: "italic", mt: 2 }}>
          No articles available.
        </Typography>
      ) : (
        articles.map((article) => (
          <Paper
            key={article.article_id}
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "#1a1a1a",
              border: "1px solid #9400FF44",
              boxShadow: "0 0 10px #9400FF55",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: "0 0 15px #9400FFaa",
                cursor: "pointer",
              },
              display: "flex",
              justifyContent: "space-between",
            }}          
            onClick={() =>
              navigate(`/community/article?id=${article.article_id}`)
            }
          >
            <Box>
              <Typography variant="h6">{article.article_title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(article.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <KeyboardArrowRightIcon sx={{ fontSize: 50, mt: 0 }} />
          </Paper>
        ))
      )}
    </Container>
  );
}

function ArticleForm(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setContent("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("Both title and content are required.");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/api/v1/community/articles`,
        {
          article_title: title,
          article_owner: userId,
          article_content: content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error("Error submitting article:", err);
      setError("Failed to submit article. Please try again.");
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Write an Article
      </Button>
      <Modal 
        open={open} 
        onClose={handleClose}   
        closeAfterTransition
        sx={{ backdropFilter: "blur(4px)" }}
      >
        <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 500,
            bgcolor: "#121212",
            border: "1px solid #9400FF88",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Write an Article
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid #9400FF44",
              },
              "& .MuiInputLabel-root": {
                color: "#ccc",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& fieldset": {
                  borderColor: "#9400FF",
                },
              },
            }}          
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={10}
            required
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid #9400FF44",
              },
              "& .MuiInputLabel-root": {
                color: "#ccc",
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& fieldset": {
                  borderColor: "#9400FF",
                },
              }
            }}          
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose}   sx={{
            backgroundColor: "#9400FF",
            color: "#fff",
            boxShadow: "0 0 10px #9400FF99",
            "&:hover": {
              backgroundColor: "#7a00cc",
              boxShadow: "0 0 15px #9400FFcc",
            },
          }}
          >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}
              sx={{
                backgroundColor: "#9400FF",
                color: "#fff",
                boxShadow: "0 0 10px #9400FF99",
                "&:hover": {
                  backgroundColor: "#7a00cc",
                  boxShadow: "0 0 15px #9400FFcc",
                },
                "&:active": {
                  transform: "scale(0.98)",
                  boxShadow: "0 0 5px #9400FF",
                },
              }}
              >
              Submit
            </Button>
          </Box>
        </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default CommunityPage;
