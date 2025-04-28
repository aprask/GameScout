import { JSX, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth/AuthContext";

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

interface ReviewData {
  user_id: string;
  rating: number;
  review: string;
  review_title: string;
}
function DynamicGame(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/api/v1/game/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setGame(res.data.game);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!game) {
    return (
      <Container>
        <Typography variant="h4">Game not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ mb: 4 }}>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          <CardMedia
            component="img"
            image={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover_id}.jpg`}
            alt={`${game.game_name} cover`}
            sx={{ maxWidth: { xs: "100%", md: 300 }, margin: "auto" }}
          />
          <CardContent sx={{ flex: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {game.game_name}
            </Typography>
            {game.release_date && (
              <Typography variant="subtitle2" color="text.secondary">
                Release Date: {new Date(game.release_date).toLocaleDateString()}
              </Typography>
            )}

            {game.summary && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {game.summary}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Reviews for {game.game_name}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box>
            <ReviewForm gameId={game.game_id} />
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mb: 4, mt: 4 }}>
        <CardContent>
          <Box>
            <GameReviews gameId={game.game_id} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

function ReviewForm({ gameId }: { gameId: string }): JSX.Element {
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");
  const [reviewText, setReviewText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [submittedReview, setSubmittedReview] = useState<ReviewData>();
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;
  

  useEffect(() => {
    try {
      const getReview = async () => {
        const response = await axios.get(
          `${baseUrl}/api/v1/review/game/${gameId}/user/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          setReviewSubmitted(true);
          setSubmittedReview(response.data.review);
        }
      };
      getReview();
    } catch (e) {
      console.log("Error: ", e);
    }
  }, []);

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
          user_id: userId,
          game_id: gameId,
          review_title: reviewTitle,
          rating: rating,
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
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again later.");
    }
  };

  if (reviewSubmitted === true)
    return (
      <>
        <Typography variant="h5">Your Review</Typography>
        <Typography variant="body2">
          Rating: {submittedReview!.rating}
        </Typography>
        <Typography variant="body2">
          Review: {submittedReview!.review}
        </Typography>
      </>
    );
  else
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6">Write a Review</Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Title"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Rating (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(+e.target.value)}
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

function GameReviews({ gameId }: { gameId: string }): JSX.Element {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/review/game/${gameId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchReviews();
    }
  }, [gameId]);

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

  if (reviews.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No reviews available for this game.
      </Typography>
    );
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <Card key={index} sx={{ mb: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {review.review_title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Rating: {review.rating} / 5
            </Typography>
            <Typography variant="body2">{review.review}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default DynamicGame;
