import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import DynamicGame from "./components/DynamicGame/DynamicGame";
import SearchGame from "./components/SearchGame/SearchGame";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router";
import GameReviews from "./components/GameReviews/GameReviews";

const customTheme = createTheme({
  palette: {
    mode: "dark", // This will be out Dark mode
    primary: {
      main: "#7F00FF", //primary color
    },
    secondary: {
      main: "#141414", //secondary color
    },
    background: {
      default: "#121212", //background color
      paper: "#121212", //paper color
      // paper: "#1e1e1e", //paper color
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <BrowserRouter>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/game" element={<DynamicGame />} />
              <Route path="/search" element={<SearchGame />} />
              <Route path="/game/:id" element={<DynamicGame />} />
              <Route path="/game/reviews/:id" element={<GameReviews />} />
            </Routes>
          </main>
        </BrowserRouter>

        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
