import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import alumnosImage from '../assets/alumnos.jpg';
import becasImage from '../assets/becas.jpg';
import cajaImage from '../assets/caja.jpg';

const imagesData = [
  { title: 'Alumnos', imageUrl: alumnosImage },
  { title: 'Becas', imageUrl: becasImage },
  { title: 'Caja', imageUrl: cajaImage },
];

const MainPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para cambiar a la imagen anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imagesData.length - 1 : prevIndex - 1));
  };

  // Función para cambiar a la siguiente imagen
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imagesData.length - 1 ? 0 : prevIndex + 1));
  };

  // Función para cambiar automáticamente a la siguiente imagen cada cierto tiempo
  useEffect(() => {
    const intervalId = setInterval(nextImage, 5000); // Cambiar cada 5 segundos
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        {/* Aquí va tu encabezado con enlaces y demás */}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {/* Flecha izquierda para retroceder */}
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md" onClick={prevImage}>
            {'<'}
          </button>
          {/* Flecha derecha para avanzar */}
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md" onClick={nextImage}>
            {'>'}
          </button>
          {/* Mostrar la imagen actual */}
          <img src={imagesData[currentImageIndex].imageUrl} alt={imagesData[currentImageIndex].title} className="w-full h-auto rounded-lg shadow-md" />
          {/* Título de la imagen */}
          <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{imagesData[currentImageIndex].title}</h2>
          </div>
          {/* Enlace para acceder a la vista correspondiente */}
          <Link to={`/${imagesData[currentImageIndex].title.toLowerCase().replace(/\s+/g, '-')}`} className="absolute bottom-4 right-4 text-blue-500 font-semibold">Ver más</Link>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
