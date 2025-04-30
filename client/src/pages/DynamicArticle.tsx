import { Typography } from "@mui/material";
import { JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress, Container } from "@mui/material";
import DisplayComments from "../components/article/DisplayComments";
import CommentForm from "../components/article/CommentForm";

interface Article {
  article_id: string;
  article_title: string;
  article_owner: string;
  article_content: string | null;
  created_at: Date;
  updated_at: Date;
}

function DynamicArticle(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (response.status === 200) setArticle(response.data.article);
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
    <Container>
      <Typography variant="h4" gutterBottom>
        {article.article_title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Posted on: {new Date(article.created_at).toLocaleDateString()}
      </Typography>
      <hr />

      <Typography variant="body1" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
        {article.article_content}
      </Typography>
      <CommentForm articleId={article.article_id} />
      <DisplayComments articleId={article.article_id} />
    </Container>
  );
}

export default DynamicArticle;
