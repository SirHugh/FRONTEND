import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import AlumnosPage from "./pages/AlumnosPage";
import NewStudent from "./pages/NewStudent";
import ResponsablesPage from "./pages/ResponsablesPage";
import NewResponsable from "./pages/NewResponsable";
import Sidebar from "./components/SideBar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="font-Poppins section">
        <Router>
          <AuthProvider>
            {/* Pasa la función toggleSidebar al componente Header */}
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/alumnos" element={<AlumnosPage />} exact />
                <Route path="/alumnos/nuevo" element={<NewStudent />} exact />
                <Route
                  path="/alumno/:id_alumno"
                  element={<NewStudent />}
                  exact
                />
                <Route
                  path="/responsables"
                  element={<ResponsablesPage />}
                  exact
                />
                <Route
                  path="/responsables/nuevo"
                  element={<NewResponsable />}
                  exact
                />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
