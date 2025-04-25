import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import DynamicGame from "./pages/DynamicGame";
import SearchGame from "./components/SearchGame/SearchGame";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameReviews from "./components/GameReviews/GameReviews";
import SignUpPage from "./pages/SignUpPage";
import { ProtectedRoute } from "./components/auth/ProtectedRouter";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import { AdminRoute } from "./components/auth/AdminRoute";
import { ProfileProvider } from "./context/ProfileContext";
import ProfilePage from "./pages/ProfilePage";

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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                    } />
                  <Route path="/search" element={
                    <ProtectedRoute>
                      <SearchGame />
                    </ProtectedRoute>
                    } />
                  <Route path="/game" element={
                    <ProtectedRoute>
                      <DynamicGame />
                    </ProtectedRoute>
                    } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                    } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>   
                    </ProtectedRoute>
                    } />
                  <Route path="/game/reviews/:id" element={
                    <ProtectedRoute>
                      <GameReviews />
                    </ProtectedRoute>
                    } />
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
