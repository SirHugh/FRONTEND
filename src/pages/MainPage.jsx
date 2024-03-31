import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import userIcon from '../assets/icons/UsuariosIcon.svg';
import studentIcon from '../assets/icons/AlumnoIcon.svg';
import boxIcon from '../assets/icons/CajaIcon.svg';
import academicIcon from '../assets/icons/academicoIcon.svg'; // Importa el icono para la sección académica

const MainPage = () => {
  // Datos para las tarjetas
  const cardData = [
    { title: 'Usuarios', icon: userIcon },
    { title: 'Alumnos', icon: studentIcon, linkTo: '/alumnos' },
    { title: 'Caja', icon: boxIcon },
    { title: 'Académico', icon: academicIcon, linkTo: '/academico' }, // Nueva tarjeta para la sección académica
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        {/* Aquí va tu encabezado con enlaces y demás */}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contenido adicional */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Renderizar tarjetas */}
            {cardData.map((card, index) => (
              <Card key={index} icon={card.icon} title={card.title} linkTo={card.linkTo} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
