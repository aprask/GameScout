import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { JSX } from "react";

interface Review {
  review_id: string;
  user_id: string;
  game_id: string;
  rating: number;
  review: string | null;
  created_at: string;
}

function GameReviews(): JSX.Element {
  const gameId = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
            ? `${import.meta.env.VITE_PROD_URL}`
            : `${import.meta.env.VITE_DEV_URL}`;

  // Fetch reviews for the game
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/reviews/${gameId}`);
        setReviews(response.data.reviews);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gameId]);

  // Submit a new review
  const handleSubmit = async () => {
    if (!newReview || rating <= 0 || rating > 5) {
      setError("Please provide a valid review and rating (1-5).");
      return;
    }

    try {
      setError(null);
      const response = await axios.post(`${baseUrl}/api/reviews`, {
        game_id: gameId,
        user_id: "current_user_id", // Replace with actual user ID
        rating,
        review_text: newReview,
      });
      setReviews((prev) => [...prev, response.data.new_review]);
      setNewReview("");
      setRating(0);
    } catch (err) {
      console.log(err);
      setError("Failed to submit the review.");
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

  return (
    <Container 
      maxWidth="md"       
      sx={{
        mt: 4,
        backgroundColor: "#0d0d0d",
        border: "1px solid #9400FF55",
        boxShadow: "0 0 20px #9400FF55",
        borderRadius: 3,
        p: 4,
      }}>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          color: "#fff",
          textShadow: "0 0 8px #9400FF88",
          fontWeight: "bold",
        }}
        >
        Reviews
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.review_id}
          sx={{
            mb: 2,
            backgroundColor: "#1a1a1a",
            border: "1px solid #9400FF33",
            boxShadow: "0 0 8px #9400FF66",
            color: "#fff",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 0 12px #9400FF99",
            },
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          >
            <CardContent>
              <Typography variant="body1">{review.review}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Rating: {review.rating} / 5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posted on: {new Date(review.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2">
          No reviews yet. Be the first to review!
        </Typography>
      )}

      <Box component="form" 
        sx={{
          color: "#fff",
          fontWeight: 600,
          textShadow: "0 0 6px #9400FFaa",
        }}      
      >
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <TextField
          label="Your Review"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
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
        <TextField
          label="Rating (1-5)"
          type="number"
          variant="outlined"
          fullWidth
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
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
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "#9400FF",
            },
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#9400FF",
            color: "#fff",
            boxShadow: "0 0 10px #9400FF88",
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
    </Container>
  );
}

export default GameReviews;
