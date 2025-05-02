import { Typography, TextField, Button } from "@mui/material";
import { JSX } from "react";
import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { useAuth } from "../../context/auth/AuthContext";

function CommentForm({ articleId }: { articleId: string }): JSX.Element {
  const [commentText, setCommentText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/api/v1/community/articles/comment`,
        {
          comment_owner: userId,
          commented_article: articleId,
          comment_content: commentText,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCommentText("");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again later.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h6">Leave a Comment</Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Comment"
        multiline
        rows={4}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" color="primary">
          Submit Comment
        </Button>
      </Box>
    </Box>
  );
}

export default CommentForm;
