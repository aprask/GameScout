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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Write a Review</Typography>
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
        sx={{ mb: 2 }}
      />
      <TextField
        label="Review"
        multiline
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Review
      </Button>
    </Box>
  );
}

export default ReviewForm;
