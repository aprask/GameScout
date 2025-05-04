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
    <Box component="form" onSubmit={handleSubmit}
      sx={{
        mt: 4,
        p: 3,
        backgroundColor: "#1a1a1a",
        border: "1px solid #9400FF55",
        borderRadius: 2,
        boxShadow: "0 0 12px #9400FF33",
      }}>
      <Typography 
          variant="h6"
          sx={{
            color: "#fff",
            textShadow: "0 0 8px #9400FFaa",
            fontWeight: "bold",
          }}
        >Leave a Comment</Typography>
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
        sx={{
          mt: 2,
          mb: 2,
          "& .MuiInputBase-root": {
            backgroundColor: "#0d0d0d",
            color: "#fff",
            border: "1px solid #9400FF44",
          },
          "& .MuiInputLabel-root": {
            color: "#ccc",
          },
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#9400FF",
          }
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" color="primary"
          sx={{
            backgroundColor: "#9400FF",
            color: "#fff",
            boxShadow: "0 0 10px #9400FF88",
            "&:hover": {
              backgroundColor: "#7a00cc",
              boxShadow: "0 0 15px #9400FFaa",
            },
            "&:active": {
              transform: "scale(0.98)",
              boxShadow: "0 0 5px #9400FF",
            },
          }}        
        >
          Submit Comment
        </Button>
      </Box>
    </Box>
  );
}

export default CommentForm;
