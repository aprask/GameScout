import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { JSX, useState } from "react";

function ReviewForm({ gameId }: { gameId: string }): JSX.Element {
  const [rating, setRating] = useState<number | "">("");
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
  ? `${import.meta.env.VITE_PROD_URL}`
  : `${import.meta.env.VITE_DEV_URL}`;
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!rating || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/review`,
        {
          user_id: "current_user_id",
          game_id: gameId,
          rating,
          review_text: reviewText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
          },
        }
      );

      if (response.status === 201) {
        setRating("");
        setReviewText("");
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again later.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 4,
        backgroundColor: "#121212",
        border: "1px solid #9400FF55",
        boxShadow: "0 0 15px #9400FF88",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#fff",
          textShadow: "0 0 8px #9400FFaa",
          fontWeight: "bold",
        }}
      >
        Write a Review
      </Typography>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Rating (1-5)"
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        fullWidth
        required
        sx={{
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
          },
        }}
      />
      <TextField
        label="Review"
        multiline
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
        sx={{
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
          },
          "& textarea": {
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained"
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
          Submit Review
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewForm;
