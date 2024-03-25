import React, { useState, useEffect } from 'react';
import { getAlumnoById } from '../services/AcademicoService';
import { useParams } from 'react-router-dom';
import AlumnoCard from './AlumnoCard'; // Importar el componente AlumnoCard

const AlumnoDetail = () => {
  const [alumno, setAlumno] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await getAlumnoById(id);
        setAlumno(response.data);
      } catch (error) {
        console.error('Error fetching alumno details:', error);
      }
    };
    fetchAlumno();
  }, [id]);

  const handleDelete = (alumnoId) => {
    // Lógica para eliminar el alumno
    console.log(`Eliminar alumno con ID ${alumnoId}`);
  };

  return (
    <div>
      {alumno ? (
        <div>
          {/* Utilizar el componente AlumnoCard */}
          <AlumnoCard alumno={alumno} onDelete={handleDelete} />
          {/* Aquí puedes añadir más detalles del alumno si es necesario */}
        </div>
      ) : (
        <p>Cargando detalles del alumno...</p>
      )}
    </div>
  );
};

export default AlumnoDetail;
