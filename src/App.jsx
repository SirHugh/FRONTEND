import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <div>
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage />} exact />
              </Route>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
