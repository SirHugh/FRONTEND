import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import userIcon from '../assets/icons/UsuariosIcon.svg';
import studentIcon from '../assets/icons/AlumnoIcon.svg';
import boxIcon from '../assets/icons/CajaIcon.svg';

const MainPage = () => {
  // Datos para las tarjetas
  const cardData = [
    { title: 'Usuarios', icon: userIcon },
    { title: 'Alumnos', icon: studentIcon, linkTo: '/alumnos' },
    { title: 'Caja', icon: boxIcon },
  ];

  // Datos de ejemplo para el gráfico
  const data = {
    labels: ['1º Grado', '2º Grado', '3º Grado', '4º Grado', '5º Grado'],
    datasets: [
      {
        label: 'Alumnos Becados',
        data: [20, 15, 10, 5, 8], // Cantidad de alumnos becados por grado
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

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