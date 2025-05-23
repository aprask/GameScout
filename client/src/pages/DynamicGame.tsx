import { JSX, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
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
  Rating,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth/AuthContext";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
import Chatbot from "../components/chat/Chatbot";

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
  updated_at: Date;
  review_id: string;
  user_id: string;
  rating: number;
  review: string;
  review_title: string;
}
function DynamicGame(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState<Number>();
  const id = searchParams.get("id");
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
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
        const review = await axios.get(
          `${baseUrl}/api/v1/review/rating/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          setGame(res.data.game);
        }
        if (review.status === 200) {
          setRating(review.data.rating);
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

  useEffect(() => {
    const fetchWishlistDetails = async () => {
      try {
        const wishlist = await axios.get(
          `${baseUrl}/api/v1/wishlist/game/${id}/user/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (wishlist.data.wishlist) {
          if (wishlist.data.wishlist.user_id === userId) {
            setWishlistId(wishlist.data.wishlist.wishlist_id);
            setIsWishlisted(true);
          }
        }
      } catch (e) {
        console.error("Error fetching wishlist: " + e);
      }
    };
    fetchWishlistDetails();
  }, [isWishlisted]);

  const addToWishlist = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/wishlist`,
        {
          user_id: userId,
          game_id: id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async () => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/wishlist/${wishlistId}?user_id=${userId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        setIsWishlisted(false);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

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
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundColor: "#0d0d0d",
        border: "1px solid #9400FF55",
        boxShadow: "0 0 20px #9400FF88",
        borderRadius: "12px",
        p: 3,
      }}
    >
      <Card
        sx={{
          mb: 4,
          backgroundColor: "#1a1a1a",
          border: "1px solid #9400FF44",
          boxShadow: "0 0 12px #9400FF77",
          borderRadius: "10px",
        }}
      >
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
          <CardMedia
            component="img"
            image={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover_id}.jpg`}
            alt={`${game.game_name} cover`}
            sx={{ maxWidth: { xs: "100%", md: 300 } }}
          />
          <CardContent sx={{ flex: 1, padding: 3, mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#fff",
                  textShadow: "0 0 8px #9400FFaa",
                  fontWeight: "bold",
                }}
              >
                {game.game_name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
                {isWishlisted ? (
                  <>
                    <IconButton
                      aria-label="Remove from Wishlist"
                      onClick={removeFromWishlist}
                      title="Remove from Wishlist"
                      sx={{
                        transition: "transform 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      <StarIcon
                        color="primary"
                        sx={{ fontSize: 40, color: "#9400FF" }}
                      />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label="Wishlist"
                      onClick={addToWishlist}
                      title="Add to Wishlist"
                    >
                      <StarBorderOutlinedIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {rating && <Rating name="review-rating" value={+rating} readOnly />}

            {game.summary && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {game.summary}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>

      <ReviewForm gameId={game.game_id} />

      <Card sx={{ mb: 4, mt: 4 }}>
        <CardContent>
          <Box>
            <GameReviews gameId={game.game_id} />
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ m: 5 }}>
        <CardContent>
          <Chatbot
            game={game.game_name || undefined}
            summary={game.summary || undefined}
          />
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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
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
        if (response.data.review) {
          if (response.data.review.user_id === userId) {
            setReviewSubmitted(true);
            setSubmittedReview(response.data.review);
          }
        }
      };
      getReview();
    } catch (e) {
      console.log("Error: ", e);
    }
  }, []);

  // Automatically populate the form with the review's current text when editing
  useEffect(() => {
    if (isEditing && submittedReview) {
      setReviewTitle(submittedReview.review_title);
      setRating(submittedReview.rating);
      setReviewText(submittedReview.review);
    }
  }, [isEditing, submittedReview]);

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
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
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

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);

    if (!rating || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }
    console.log("1");

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/review/${submittedReview?.review_id}`,
        {
          review_title: reviewTitle,
          rating: rating,
          review_text: reviewText,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setRating("");
        setReviewText("");
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again later.");
    }
  };

  if (reviewSubmitted)
    if (isEditing) {
      return (
        <>
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleEdit}>
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
                <Box>
                  <Rating
                    name="star-rating"
                    value={+rating}
                    onChange={(_event, newValue) => {
                      setRating(+newValue!);
                    }}
                  />
                </Box>

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

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
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
                    Update Review
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      );
    } else
      return (
        <>
          <Card sx={{ backgroundColor: "primary.main" }}>
            <CardContent>
              <Paper
                elevation={6}
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #9400FF33",
                  boxShadow: "0 0 8px #9400FF66",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0 0 12px #9400FF99",
                  },
                }}
              >
                <Container>
                  <Typography variant="h6">
                    {submittedReview?.review_title}
                  </Typography>

                  <Rating
                    name="review-rating"
                    value={+submittedReview!.rating}
                    readOnly
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    Review Made:
                    {" " +
                      new Date(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                        submittedReview?.updated_at!
                      ).toLocaleDateString()}
                  </Typography>
                  <hr />
                  {submittedReview!.review && (
                    <Typography variant="body2">
                      {submittedReview!.review}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={() => setIsEditing(true)}
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
                      Edit Review
                    </Button>
                  </Box>
                </Container>
              </Paper>
            </CardContent>
          </Card>
        </>
      );
  else
    return (
      <Card>
        <CardContent>
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
            <Box>
              <Rating
                name="star-rating"
                value={+rating}
                onChange={(_event, newValue) => {
                  setRating(+newValue!);
                }}
              />
            </Box>

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

            <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
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
          </Box>
        </CardContent>
      </Card>
    );
}

function GameReviews({ gameId }: { gameId: string }): JSX.Element {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfiles, setUserProfiles] = useState<
    Record<
      string,
      { profile_name: string; profile_img: string; profile_id: string }
    >
  >({});
  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
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
          const reviews = response.data.reviews;
          const userProfiles: Record<
            string,
            { profile_name: string; profile_img: string; profile_id: string }
          > = {};

          await Promise.all(
            reviews.map(async (review) => {
              const profileResponse = await axios.get(
                `${baseUrl}/api/v1/profile/user/${review.user_id}`,
                {
                  withCredentials: true,
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (profileResponse.status === 200) {
                userProfiles[review.user_id] = {
                  profile_name: profileResponse.data.profile.profile_name,
                  profile_img: profileResponse.data.profile.profile_img,
                  profile_id: profileResponse.data.profile.profile_id,
                };
              }
            })
          );

          setUserProfiles(userProfiles);
          setReviews(reviews);
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
      <Typography variant="body2">Reviews</Typography>

      {reviews.map((review, index) => (
        <Paper
          key={index}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "#1a1a1a",
            border: "1px solid #9400FF33",
            boxShadow: "0 0 8px #9400FF66",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 0 12px #9400FF99",
            },
          }}
          elevation={6}
        >
          <Typography variant="h6" fontWeight="bold">
            {review.review_title}
          </Typography>
          <Box sx={{ mb: 1, mt: 1 }}>
            <NavLink
              to={`/profile/${userProfiles[review.user_id]?.profile_id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Avatar
                src={userProfiles[review.user_id]?.profile_img || undefined}
                alt={
                  userProfiles[review.user_id]?.profile_name ||
                  "Profile Picture"
                }
                sx={{ width: 24, height: 24, border: "1px solid #9400FF" }}
              />
              <Typography
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {userProfiles[review.user_id]?.profile_name || "Unknown User"}
              </Typography>
            </NavLink>
          </Box>
          <Rating name="review-rating" value={+review.rating} readOnly />
          <Typography variant="subtitle2" color="text.secondary">
            Posted:
            {" " + new Date(review.updated_at!).toLocaleDateString()}
          </Typography>
          <hr />
          <Typography variant="body2">{review.review}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default DynamicGame;
