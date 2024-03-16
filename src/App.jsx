import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import AlumnosPage from "./pages/AlumnosPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <div>
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<MainPage />} exact />
                <Route path="/alumnos" element={<AlumnosPage />} exact />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
