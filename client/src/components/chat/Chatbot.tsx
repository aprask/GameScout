import { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { Send } from "@mui/icons-material";
import { Card, Fab, Box, TextareaAutosize, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chatbot() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const { isAuthenticated } = useAuth();

    const baseUrl = import.meta.env.VITE_APP_ENV === "production"
        ? import.meta.env.VITE_PROD_CHAT_URL
        : import.meta.env.VITE_DEV_CHAT_URL;

    const makeQuery = async () => {
        if (!isAuthenticated || !query.trim()) return;
        setLoading(true);
        setOutput("");

        try {
            const res = await axios.post(
                `${baseUrl}/chatbot/query`,
                { query },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
                    },
                }
            );
            if (res.status === 200) {
                setOutput(res.data.response);
            } else {
                setOutput("Sorry, we couldn't process your query.");
            }
        } catch (err) {
            console.error("Error:", err);
            setOutput("Sorry, we couldn't process your query.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
            <Typography>Chatbot</Typography>
            <Box sx={{ mb: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : output && (
                    <Card elevation={3} sx={{ p: 2, whiteSpace: "pre-line" }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {output}
                        </ReactMarkdown>
                    </Card>
                )}
            </Box>

            <Box sx={{ position: 'relative', mt: 2 }}>
                <TextareaAutosize
                    minRows={4}
                    maxRows={10}
                    placeholder="Ask me a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        resize: "vertical",
                        boxSizing: "border-box",
                    }}
                />
                <Fab
                    color="primary"
                    size="medium"
                    onClick={makeQuery}
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                >
                    <Send />
                </Fab>
            </Box>
        </Box>
    );
}
