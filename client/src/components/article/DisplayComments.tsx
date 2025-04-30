import { Typography, Paper } from "@mui/material";
import { JSX } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";

interface Comment {
  comment_id: string;
  comment_owner: string;
  commented_article: string;
  comment_content: string;
  created_at: Date;
  updated_at: Date;
}

function DisplayComments({ articleId }: { articleId: string }): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/community/articles/comments/by-article/${articleId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No comments available for this article.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Comments</Typography>
      {comments.map((comment) => (
        <Paper key={comment.comment_id} sx={{ mb: 2, p: 2 }} elevation={6}>
          <Typography variant="body2" color="text.secondary">
            Posted on: {new Date(comment.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {comment.comment_content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default DisplayComments;
