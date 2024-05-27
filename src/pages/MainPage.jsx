import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import userIcon from "../assets/icons/UsuariosIcon.svg";
import studentIcon from "../assets/icons/AlumnoIcon.svg";
import boxIcon from "../assets/icons/CajaIcon.svg";
import academicIcon from "../assets/icons/academicoIcon.svg"; // Importa el icono para la sección académica
import useAuth from "../hooks/useAuth"; // Importa tu hook de autenticación

const MainPage = () => {
  const { user } = useAuth(); // Obtiene la información del usuario
  const userGroups = user?.groups || [];

  // Datos para las tarjetas
  const cardData = [
    { title: "Alumnos", icon: studentIcon, linkTo: "/alumnos", allowedGroup: "ACADEMICO" },
    { title: "Caja", icon: boxIcon, linkTo: "/caja", allowedGroup: "CAJA" },
    { title: "Matricular Alumno", icon: academicIcon, linkTo: "/Matriculas", allowedGroup: "ACADEMICO" }, // Nueva tarjeta para la sección académica
  ];

  return (
    <div className="min-h-full bg-gray-100">
      <header className="bg-white shadow-sm">
        {/* Aquí va tu encabezado con enlaces y demás */}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido adicional */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Renderizar tarjetas */}
            {cardData.map((card, index) => (
              userGroups.includes(card.allowedGroup) && (
                <Card
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  linkTo={card.linkTo}
                />
              )
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
