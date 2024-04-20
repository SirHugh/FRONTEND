import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import GradosPage from "./pages/GradosPage";
import BecasPage from "./pages/BecasPage";
import CajaPage from "./pages/CajaPage";

const GROUPS = {
  ACADEMICO: "ACADEMICO",
  INSCRIPCION: "INSCRIPCION",
  CAJA: "CAJA",
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex flex-row h-full">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col w-screen">
          {/* Pasa la función toggleSidebar al componente Header */}
          <Header toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoutes allowedGroup={GROUPS.ACADEMICO} />}>
              <Route path="/" element={<MainPage />} exact />
              <Route path="/alumnos" element={<AlumnosPage />} exact />
              <Route path="/alumnos/:id" element={<AlumnoDetail />} />
              <Route path="/matriculas" element={<MatriculacionPage />} />
              <Route path="/grados" element={<GradosPage />} />
              <Route path="/becas" element={<BecasPage />} />
            </Route>
            <Route element={<PrivateRoutes allowedGroup={GROUPS.CAJA} />}>
              <Route path="/caja" element={<CajaPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
