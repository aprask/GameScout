import { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { Send } from "@mui/icons-material";
import {
  Card,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot({game, summary}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const { isAuthenticated } = useAuth();

  const baseUrl =
    `${import.meta.env.VITE_APP_ENV}` === "production"
      ? `${import.meta.env.VITE_PROD_URL}`
      : `${import.meta.env.VITE_DEV_URL}`;

  const makeQuery = async () => {
    if (!isAuthenticated || !query.trim() || loading) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/chatbot`,
        { query: query,
          game: game,
          summary: summary
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOutput(res.status === 200 ? res.data.response : "Sorry, we couldn't process your query.");
    } catch (err) {
      console.error("Error:", err);
      setOutput("Sorry, we couldn't process your query.");
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      makeQuery();
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "#1a1a1a",
        border: "1px solid #9400FF44",
        boxShadow: "0 0 12px #9400FF55",
        borderRadius: 2,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            color: "#fff",
            textShadow: "0 0 10px #9400FFaa",
          }}
        >
          Chatbot
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : output ? (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#121212",
            border: "1px solid #9400FF33",
            boxShadow: "0 0 8px #9400FF66",
            borderRadius: 2,
            color: "#fff",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          mt: 2,
        }}
      >
        <Box
          component="textarea"
          placeholder="Ask me a question about this game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3}
          style={{
            flex: 1,
            fontSize: "1rem",
            resize: "none",
            padding: "12px",
            borderRadius: "8px",
            fontFamily: "inherit",
            backgroundColor: "#0d0d0d",
            color: "#fff",
            border: "1px solid #9400FF44",
            outline: "none",
            scrollbarWidth: "none",
          }}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        />

        <Tooltip title="Send" arrow>
          <span>
            <IconButton
              color="primary"
              onClick={makeQuery}
              disabled={loading || !query.trim()}
              sx={{
                backgroundColor: "#9400FF",
                color: "#fff",
                boxShadow: "0 0 10px #9400FF99",
                "&:hover": {
                  backgroundColor: "#7a00cc",
                  boxShadow: "0 0 15px #9400FFcc",
                },
                "&:active": {
                  transform: "scale(0.95)",
                  boxShadow: "0 0 6px #9400FFaa",
                },
              }}
            >
              <Send />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Card>
  );
}
