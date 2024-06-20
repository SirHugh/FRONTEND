import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import userIcon from "../assets/icons/UsuariosIcon.svg";
import studentIcon from "../assets/icons/AlumnoIcon.svg";
import boxIcon from "../assets/icons/CajaIcon.svg";
import academicIcon from "../assets/icons/academicoIcon.svg"; // Importa el icono para la sección académica
import usersIcon from "../assets/icons/usersIcon.svg";
import backpackIcon from "../assets/icons/backpack.svg";
import honourIcon from "../assets/icons/honour.svg";
import useAuth from "../hooks/useAuth"; // Importa tu hook de autenticación
import MatriculacionesDashboard from "../components/Dashboards/MatriculacionesDashboard";
import AlumnosPorGradoDashboard from "../components/Dashboards/AlumnosPorGradoDashboard";
import RetencionesDashboard from "../components/Dashboards/RetencionesDashboard";

const MainPage = () => {
  const { user } = useAuth(); // Obtiene la información del usuario
  const userGroups = user?.groups || [];

  // Datos para las tarjetas
  const cardData = [
    { title: "Alumnos", icon: studentIcon, linkTo: "/alumnos", allowedGroup: "ACADEMICO" },
    { title: "Matriculaciones", icon: academicIcon, linkTo: "/Matriculas", allowedGroup: "ACADEMICO" },
    { title: "Becas", icon: honourIcon, linkTo: "/becas", allowedGroup: "ACADEMICO" },
    { title: "Facturación", icon: boxIcon, linkTo: "/factura", allowedGroup: "CAJA" },
    { title: "Productos", icon: backpackIcon, linkTo: "/productos", allowedGroup: "CAJA" },
    { title: "Usuarios", icon: usersIcon, linkTo: "/usuarios", allowedGroup: "ADMIN" },
  ];

  // Datos para los dashboards
  const dashboardData = [
    { component: MatriculacionesDashboard, title: "Matriculaciones", allowedGroup: "ACADEMICO" },
    { component: AlumnosPorGradoDashboard, title: "Alumnos por Grado", allowedGroup: "ACADEMICO" },
    { component: RetencionesDashboard, title: "Porcentaje de retención", allowedGroup: "ACADEMICO" },
    // Agrega más dashboards según sea necesario
  ];

  // Filtrar tarjetas permitidas para el usuario actual
  const filteredCardData = cardData.filter(card => userGroups.includes(card.allowedGroup));

  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-white shadow-sm">
        {/* Aquí va tu encabezado con enlaces y demás */}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Renderizar tarjetas */}
          {filteredCardData.map((card, index) => (
            <Card
              key={index}
              icon={card.icon}
              title={card.title}
              linkTo={card.linkTo}
            />
          ))}
        </div>
      </main>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Renderizar dashboards */}
          {dashboardData.map((dashboard, index) => (
            userGroups.includes(dashboard.allowedGroup) && (
              <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                <dashboard.component />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
