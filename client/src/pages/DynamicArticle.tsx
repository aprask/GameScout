import { Avatar, IconButton, Typography } from "@mui/material";
import { JSX } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Container } from "@mui/material";
import DisplayComments from "../components/article/DisplayComments";
import CommentForm from "../components/article/CommentForm";
import { useAuth } from "../context/auth/AuthContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Article {
  article_id: string;
  article_title: string;
  article_owner: string;
  article_content: string | null;
  created_at: Date;
  updated_at: Date;
}

interface User {
  user_id: string;
  email: string;
  google_token: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
  is_banned: boolean;
  profile_name?: string;
  profile_img?: string;
}

function DynamicArticle(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState<Article | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [ownerProfID, setOwnerProfID] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/community/articles/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setArticle(response.data.article);

          const userResponse = await axios.get(
            `${baseUrl}/api/v1/users/${response.data.article.article_owner}`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (userResponse.status === 200) {
            const profileResponse = await axios.get(
              `${baseUrl}/api/v1/profile/user/${response.data.article.article_owner}`,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (profileResponse.status === 200) {
              setOwnerProfID(profileResponse.data.profile.profile_id);

              setOwner({
                ...userResponse.data.user,
                profile_name: profileResponse.data.profile.profile_name,
                profile_img: profileResponse.data.profile.profile_img,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to fetch article.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const deleteArticle = async () => {
    try {
      await axios.delete(
        `${baseUrl}/api/v1/community/articles/${article?.article_id}?article_owner=${userId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = "/community";
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

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

  if (!article) {
    return (
      <Container>
        <Typography variant="h6" textAlign="center">
          Article not found.
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
        borderRadius: 2,
        p: 4,
        color: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textShadow: "0 0 10px #9400FFaa",
            fontWeight: "bold",
          }}
        >
          {article.article_title}
        </Typography>
        {article.article_owner === userId && (
          <IconButton
            sx={{
              color: "#fff",
              backgroundColor: "#9400FF33",
              border: "1px solid #9400FF55",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 0 10px #9400FFaa",
              },
              "&:active": {
                transform: "scale(0.98)",
                boxShadow: "0 0 5px #9400FF",
              },
            }}
            onClick={deleteArticle}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ mb: 1 }}>
        <NavLink
          to={`/profile/${ownerProfID}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Avatar
            src={owner?.profile_img || undefined}
            alt={owner?.profile_name || "Profile Picture"}
            sx={{ width: 32, height: 32, border: "1px solid #9400FF" }}
          />
          <Typography
            sx={{
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {owner?.profile_name || "Unknown User"}
          </Typography>
        </NavLink>
      </Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ color: "#ccc", mb: 2, textShadow: "0 0 6px #9400FF33" }}
      >
        Posted on: {new Date(article.created_at).toLocaleDateString()}
      </Typography>
      <hr />

      <Typography
        variant="body1"
        gutterBottom
        sx={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#1a1a1a",
          p: 2,
          borderRadius: 2,
          border: "1px solid #9400FF44",
          boxShadow: "0 0 8px #9400FF33",
          mb: 4,
          "& textarea": {
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
        }}
      >
        {article.article_content}
      </Typography>

      <CommentForm articleId={article.article_id} />
      <DisplayComments articleId={article.article_id} />
    </Container>
  );
}

export default DynamicArticle;
