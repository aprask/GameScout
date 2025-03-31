import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/Footer";

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
        <NavBar />
        <Dashboard />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
