import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import DynamicGame from "./pages/DynamicGame";
import SearchGame from "./pages/SearchGame";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameReviews from "./components/GameReviews/GameReviews";
import { ProtectedRoute } from "./components/auth/ProtectedRouter";
import { AuthProvider } from "./context/auth/AuthContext";
import AdminPage from "./pages/AdminPage";
import { AdminRoute } from "./components/auth/AdminRoute";
import { ProfileProvider } from "./context/profile/ProfileContext";
import ProfilePage from "./pages/ProfilePage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import GoogleAuth from "./pages/GoogleAuth";
import CommunityPage from "./pages/CommunityPage";
import DynamicArticle from "./pages/DynamicArticle";

const customTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7F00FF",
    },
    secondary: {
      main: "#141414",
    },
    background: {
      default: "#121212",
      paper: "#121212",
    },
  },
});

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <ThemeProvider theme={customTheme}>
              <CssBaseline />
              <NavBar />
              <main>
                <Routes>
                  <Route path="/login" element={<GoogleAuth />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <SearchGame />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/game"
                    element={
                      <ProtectedRoute>
                        <DynamicGame />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/:id"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/game/reviews/:id"
                    element={
                      <ProtectedRoute>
                        <GameReviews />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/community"
                    element={
                      <ProtectedRoute>
                        <CommunityPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/community/article"
                    element={
                      <ProtectedRoute>
                        <DynamicArticle />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/oauth/callback"
                    element={<OAuthCallbackPage />}
                  />
                </Routes>
              </main>
              <Footer />
            </ThemeProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
