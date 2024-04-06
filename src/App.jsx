import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import AlumnosPage from "./pages/AlumnosPage";
import MainPage from "./pages/MainPage";
import AlumnoDetail from "./components/AlumnoDetail";
import Sidebar from "./components/SideBar";
import MatriculacionPage from "./pages/MatriculacionPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const RedirectToExternalURL = () => {
    // Redirigir a la URL deseada en una nueva ventana
    React.useEffect(() => {
      const externalURL = 'http://localhost:5173/multi-step-form-vite-react/';
      window.open(externalURL, '_blank');
    }, []);
  
    // Renderizar un componente vacío o un mensaje mientras se redirige
    return null;
  };

  return (
    <>
      <Router>
        <AuthProvider>
          {/* Pasa la función toggleSidebar al componente Header */}
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<MainPage />} exact />
              <Route path="/alumnos" element={<AlumnosPage />} exact />
              <Route path="/alumnos/:id" element={<AlumnoDetail />} />
              <Route path="/academico" element={<RedirectToExternalURL />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
