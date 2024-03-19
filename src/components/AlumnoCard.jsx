import React from 'react';

const AlumnoCard = ({ alumno, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold">{`${alumno.apellido}, ${alumno.nombre}`}</h2>
      <p className="text-sm text-gray-500">{`CI: ${alumno.cedula} | Fecha de Nacimiento: ${alumno.fecha_nac} | Teléfono: ${alumno.telefono }`}</p>
      <div className="flex justify-end mt-4">
        <button className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2">Modificar</button>
        <button className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">Visualizar</button>
        <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => onDelete(alumno.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default AlumnoCard;
