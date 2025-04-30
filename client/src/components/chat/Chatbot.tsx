import { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { Send } from "@mui/icons-material";
import {
  Card,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot({game}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

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
          game: game
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
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Box display="flex" justifyContent="center">
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Chatbot
            </Typography>
        </Box>
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : output ? (
          <Card elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
          </Card>
        ) : null}
      </Box>

      <Card elevation={2} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
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
              border: "none",
              outline: "none",
              fontSize: "1rem",
              resize: "none",
              padding: "12px",
              borderRadius: "8px",
              fontFamily: "inherit",
              backgroundColor: loading
                ? theme.palette.action.disabledBackground
                : theme.palette.background.default,
              color: theme.palette.text.primary,
              opacity: loading ? 0.6 : 1,
            }}
          />
          <Tooltip title="Send" arrow>
            <span>
              <IconButton
                color="primary"
                onClick={makeQuery}
                disabled={loading || !query.trim()}
                sx={{ mb: "4px" }}
              >
                <Send />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Card>
    </Box>
  );
}
