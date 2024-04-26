import React, { useState, useEffect } from 'react';
import { getResponsables } from '../services/AcademicoService';

const ResponsableDetail = ({ alumnoId }) => {
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const response = await getResponsables();
        setResponsables(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching responsables:', error);
      }
    };
    fetchResponsables();
  }, []);

  const responsablesAlumno = responsables.filter(responsable => responsable.alumno === alumnoId);

  return (
    <div className="bg-white-100 p-4 rounded-md shadow-md">
      <h1 className="text-primary">Responsables del Alumno</h1>
      <hr className="my-4" />
      <ul>
        {responsablesAlumno.map(responsable => (
          <li key={responsable.id} className="flex justify-between mb-4">
            <div>
              <h2>{responsable.cliente.nombre} {responsable.cliente.apellido}</h2>
              <p>Ocupación: {responsable.ocupacion}</p>
              <p>Tipo de relación: {responsable.tipo_relacion}</p>
              <p>Estado: {responsable.es_activo ? 'Activo' : 'Inactivo'}</p>
            </div>
            {/* Botones de acciones (editar, eliminar, etc.) aquí si es necesario */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResponsableDetail;
