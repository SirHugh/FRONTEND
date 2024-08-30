import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";
import MatriculacionesDashboard from "../components/Dashboards/MatriculacionesDashboard";
import AlumnosPorGradoDashboard from "../components/Dashboards/AlumnosPorGradoDashboard";
import RetencionesDashboard from "../components/Dashboards/RetencionesDashboard";
import ComprasVsVentasDashboard from "../components/Dashboards/ComprasVsVentasDashboard";
import ArancelesDashboard from "../components/Dashboards/ArancelesDashboard";
import FlujoCajaDashboard from "../components/Dashboards/FlujoCajaDashboard";
import studentIcon from "../assets/icons/AlumnoIcon.svg";
import academicIcon from "../assets/icons/academicoIcon.svg";
import honourIcon from "../assets/icons/honour.svg";
import boxIcon from "../assets/icons/CajaIcon.svg";
import backpackIcon from "../assets/icons/backpack.svg";
import ventaIcon from "../assets/icons/ventaIcon.svg";
import usersIcon from "../assets/icons/usersIcon.svg";
import ComercialKPI from "../components/Dashboards/ComercialKPI";
import CajaKPI from "../components/Dashboards/CajaKPI";
import AcademicoKPI from "../components/Dashboards/AcademicoKPI";

const MainPage = () => {
  const { user } = useAuth(); // Obtiene la información del usuario
  const userGroups = user?.groups || [];

  // Datos para las tarjetas
  const cardData = [
    {
      title: "Alumnos",
      icon: studentIcon,
      linkTo: "/alumnos",
      allowedGroup: "ACADEMICO",
    },
    {
      title: "Matriculaciones",
      icon: academicIcon,
      linkTo: "/Matriculas",
      allowedGroup: "ACADEMICO",
    },
    {
      title: "Becas",
      icon: honourIcon,
      linkTo: "/becas",
      allowedGroup: "ACADEMICO",
    },
    {
      title: "Facturación",
      icon: boxIcon,
      linkTo: "/factura",
      allowedGroup: "CAJA",
    },
    {
      title: "Productos",
      icon: backpackIcon,
      linkTo: "/productos",
      allowedGroup: "CAJA",
    },
    {
      title: "Ventas",
      icon: ventaIcon,
      linkTo: "/ventas",
      allowedGroup: "CAJA",
    },
    {
      title: "Usuarios",
      icon: usersIcon,
      linkTo: "/usuarios",
      allowedGroup: "ADMIN",
    },
  ];

  // Datos para los dashboards
  const dashboardData = [
    {
      component: MatriculacionesDashboard,
      title: "Matriculaciones",
      allowedGroup: "ACADEMICO",
    },
    {
      component: AlumnosPorGradoDashboard,
      title: "Alumnos por Grado",
      allowedGroup: "ACADEMICO",
    },
    {
      component: RetencionesDashboard,
      title: "Porcentaje de retención",
      allowedGroup: "ACADEMICO",
    },
    {
      component: ComprasVsVentasDashboard,
      title: "Compras vs Ventas",
      allowedGroup: "CAJA",
    },
    { component: ArancelesDashboard, title: "Aranceles", allowedGroup: "CAJA" },
    {
      component: FlujoCajaDashboard,
      title: "Flujo de caja",
      allowedGroup: "CAJA",
    },
    // Agrega más dashboards según sea necesario
  ];

  const kpiComponents = [
    {
      component: ComercialKPI,
      title: "Comercial KPI",
      allowedGroup: "ADMIN",
    },
  ];

  // Función para determinar las clases de TailwindCSS según el número de tarjetas
  // const getGridClass = (numCards) => {
  //   switch (numCards) {
  //     case 1:
  //       return "grid-cols-1";
  //     case 2:
  //       return "grid-cols-1 md:grid-cols-2";
  //     case 3:
  //       return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  //     default:
  //       return `grid-cols-1 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-${numCards}`;
  //   }
  // };

  // Filtrar tarjetas permitidas para el usuario actual
  // const filteredCardData = cardData.filter((card) =>
  //   userGroups.includes(card.allowedGroup)
  // );

  // const filteredKpiComponents = kpiComponents.filter(
  //   (Kpi_component) => Kpi_component.allowedGroup !== "ADMIN"
  // );

  const filteredUserGroups = userGroups.filter((group) => group !== "ADMIN");

  const filteredDashboardData = dashboardData.filter(
    (dashboard) => dashboard.allowedGroup !== "ADMIN"
  );

  return (
    <div className="min-h-full bg-gray-100">
      <main className="p-4">
        {/* Contenedor para los KPI */}
        <div className="flex flex-wrap gap-4 justify-center">
          <ComercialKPI />

          <AcademicoKPI />

          <CajaKPI />
        </div>

        {/* Contenedor para los dashboard components */}
        {filteredUserGroups.map((group, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredDashboardData
                .filter((dashboard) => dashboard.allowedGroup === group)
                .map((dashboard, dashboardIndex) => (
                  <div key={dashboardIndex} className="p-4 bg-white shadow-sm">
                    <dashboard.component />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MainPage;
