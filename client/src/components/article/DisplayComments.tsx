import { Typography, Paper, IconButton, Avatar } from "@mui/material";
import { JSX } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/auth/AuthContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { NavLink } from "react-router-dom";

interface Comment {
  comment_id: string;
  comment_owner: string;
  commented_article: string;
  comment_content: string;
  created_at: Date;
  updated_at: Date;
  comment_owner_name: string;
}

function DisplayComments({ articleId }: { articleId: string }): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmails, setUserEmails] = useState<
    Record<
      string,
      { profile_name: string; profile_img: string; profile_id: string }
    >
  >({});
  const { userId } = useAuth();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  const deleteComment = async (comment: Comment) => {
    try {
      await axios.delete(
        `${baseUrl}/api/v1/community/articles/comment/${comment.comment_id}?comment_owner=${userId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setComments((prevComments) =>
        prevComments.filter((c) => c.comment_id !== comment.comment_id)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

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
          const comments = response.data.comments;
          const userProfiles: Record<
            string,
            { profile_name: string; profile_img: string; profile_id: string }
          > = {};

          await Promise.all(
            comments.map(async (comment) => {
              const profileResponse = await axios.get(
                `${baseUrl}/api/v1/profile/user/${comment.comment_owner}`,
                {
                  withCredentials: true,
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (profileResponse.status === 200) {
                userProfiles[comment.comment_owner] = {
                  profile_name: profileResponse.data.profile.profile_name,
                  profile_img: profileResponse.data.profile.profile_img,
                  profile_id: profileResponse.data.profile.profile_id,
                };
              }
            })
          );

          setUserEmails(userProfiles);
          setComments(comments);
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
        <Paper
          key={comment.comment_id}
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "#121212",
            border: "1px solid #9400FF33",
            borderRadius: 2,
            boxShadow: "0 0 10px #9400FF44",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: "0 0 15px #9400FFaa",
            },
            display: "flex",
            justifyContent: "space-between",
            color: "#fff",
          }}
          elevation={6}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#bbb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <NavLink
                to={`/profile/${userEmails[comment.comment_owner]?.profile_id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Avatar
                  src={
                    userEmails[comment.comment_owner]?.profile_img || undefined
                  }
                  alt={
                    userEmails[comment.comment_owner]?.profile_name ||
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
                  {userEmails[comment.comment_owner]?.profile_name ||
                    "Unknown User"}
                </Typography>
              </NavLink>
            </Typography>
            <Typography variant="caption" sx={{ color: "#777" }}>
              Posted on: {new Date(comment.created_at).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                color: "#fff",
                whiteSpace: "pre-wrap",
              }}
            >
              {comment.comment_content}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {comment.comment_owner === userId && (
              <IconButton
                aria-label="Remove Comments"
                onClick={() => deleteComment(comment)}
                sx={{
                  color: "#fff",
                  backgroundColor: "#9400FF22",
                  border: "1px solid #9400FF55",
                  ml: 2,
                  "&:hover": {
                    backgroundColor: "#9400FF44",
                    boxShadow: "0 0 10px #9400FFaa",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0 0 5px #9400FF",
                  },
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default DisplayComments;
