import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Header from "./components/Header";
import PrivateRoutes from "./utils/PrivateRoutes";
import AlumnosPage from "./pages/AlumnosPage";
import MainPage from "./pages/MainPage";
import AlumnoDetail from "./components/AlumnoDetail";
import Sidebar from "./components/SideBar";
import MatriculacionPage from "./pages/MatriculacionPage";
import GradosPage from "./pages/GradosPage";
import BecasPage from "./pages/BecasPage";
import UsersPage from "./pages/UsersPage";
import ResponsablesPage from "./pages/ResponsablesPage";
import ProductosPage from "./pages/ProductosPage";
import { Toaster } from "react-hot-toast";
import FacturaPage from "./pages/FacturaPage";
import TimbradoPage from "./pages/TimbradoPage";
import BasicsInfoPage from "./pages/BasicsInfoPage";
import DashBoardsPage from "./pages/DashBoardsPage";
import VentasPage from "./pages/VentasPage";
import PeriodoPage from "./pages/PeriodoPage";
import ComprasPage from "./pages/ComprasPage";
import FlujoCajaPage from "./pages/FlujoCajaPage";
import ActividadPage from "./pages/ActividadPage";
// import UserProfilePage from "./pages/UserProfilePage";
import InventarioPage from "./pages/InventarioPage";
import ArancelesPage from "./pages/ArancelesPage";
import EstadoDeCuentaPage from "./pages/EstadoDeCuentaPage";
import ControlStock from "./components/Inventario/ControlStock";
import PrintFacturaPage from "./pages/PrintFacturaPage";
import Profile from "./pages/Profile";
import NuevaFactura from "./components/Factura/NuevaFactura";

const GROUPS = {
  ACADEMICO: "ACADEMICO",
  INSCRIPCION: "INSCRIPCION",
  CAJA: "CAJA",
  ADMIN: "ADMIN",
  COMERCIAL: "COMERCIAL",
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Toaster position="top-center"></Toaster>
      <div className="flex flex-row h-full">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col w-screen">
          {/* Pasa la función toggleSidebar al componente Header */}
          <Header toggleSidebar={toggleSidebar} />
          <div>
            <Routes>
              <Route path="/" element={<MainPage />} exact />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                element={<PrivateRoutes allowedGroup={GROUPS.ACADEMICO} />}
              >
                <Route path="/alumnos" element={<AlumnosPage />} exact />
                <Route path="/alumnos/:id/" element={<AlumnoDetail />} />
                <Route path="/matriculas" element={<MatriculacionPage />} />
                <Route path="/grados" element={<GradosPage />} />
                <Route path="/becas" element={<BecasPage />} />
                <Route path="/responsables" element={<ResponsablesPage />} />
                <Route
                  path="/academicoDashboards"
                  element={<DashBoardsPage />}
                />
              </Route>
              <Route element={<PrivateRoutes allowedGroup={GROUPS.CAJA} />}>
                <Route path="/ventas" element={<VentasPage />} />
                <Route path="/factura" element={<FacturaPage />} />
                <Route
                  path="/printFactura/:id/"
                  element={<PrintFacturaPage />}
                />
                <Route path="/factura/nuevo" element={<NuevaFactura />} />
                <Route path="/timbrado" element={<TimbradoPage />} />
                <Route path="/compras" element={<ComprasPage />} />
                <Route path="/flujoCaja" element={<FlujoCajaPage />} />
                <Route path="/flujoCaja/:id" element={<FlujoCajaPage />} />
                <Route path="/actividades" element={<ActividadPage />} />
                <Route
                  path="/estadoDeCuenta"
                  element={<EstadoDeCuentaPage />}
                />
              </Route>
              <Route element={<PrivateRoutes allowedGroup={GROUPS.ADMIN} />}>
                <Route path="/usuarios" element={<UsersPage />} />
                <Route path="/basics" element={<BasicsInfoPage />} />
                <Route path="/periodo" element={<PeriodoPage />} />
              </Route>
              <Route
                element={<PrivateRoutes allowedGroup={GROUPS.COMERCIAL} />}
              >
                <Route path="/productos" element={<ProductosPage />} />
                <Route path="/actividades" element={<ActividadPage />} />
                <Route path="/aranceles" element={<ArancelesPage />} />
                <Route path="/inventario" element={<InventarioPage />} />
                <Route path="/control-stock/:id/" element={<ControlStock />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
