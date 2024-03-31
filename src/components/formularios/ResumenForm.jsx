import React from 'react';

const ResumenForm = ({ alumnoData, responsableData, academicoData, onClose, onSubmit }) => {
  const handleSubmit = () => {
    // Aquí puedes manejar la lógica de confirmación de inscripción
    // Por ejemplo, llamar a la función onSubmit
    onSubmit();
  };

  return (
    <div>
      <h2>Resumen</h2>
      <div className="mb-6">
        <h3>Datos del Alumno</h3>
        <p>Cédula: {alumnoData.cedula}</p>
        <p>Nombre: {alumnoData.nombre}</p>
        {/* Agregar los demás campos del alumno aquí */}
      </div>
      <div className="mb-6">
        <h3>Datos del Responsable</h3>
        <p>Cédula: {responsableData.cedula}</p>
        <p>Nombre: {responsableData.nombre}</p>
        {/* Agregar los demás campos del responsable aquí */}
      </div>
      <div className="mb-6">
        <h3>Datos Académicos</h3>
        <p>ID de Grado: {academicoData.id_grado}</p>
        <p>Año Lectivo: {academicoData.anio_lectivo}</p>
        {/* Agregar los demás campos académicos aquí */}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Volver
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Confirmar Inscripción
        </button>
      </div>
    </div>
  );
};

export default ResumenForm;
