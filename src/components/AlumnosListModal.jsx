import React from 'react';

const AlumnosListModal = ({ show, onClose, alumnos, grado, seccion, turno }) => {

  // Función para descargar la lista de alumnos como archivo SVG
  const downloadAsSVG = () => {
    const svgContent = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Aquí puedes agregar el contenido SVG que desees -->
        <text x="10" y="20" font-family="Arial" font-size="16" fill="black">Lista de Alumnos</text>
        ${alumnos.map((alumno, index) => `
          <text x="10" y="${index * 20 + 40}" font-family="Arial" font-size="12" fill="black">
            ${alumno.id_alumno.nombre} ${alumno.id_alumno.apellido}
          </text>
        `).join('')}
      </svg>
    `;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_alumnos.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {show && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="modal-container bg-white w-full max-w-lg mx-auto p-8 rounded-md shadow-xl z-50">
              <h2 className="text-2xl font-bold mb-6">Alumnos del {grado} sección {seccion} turno {turno}</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Apellido</th>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Cédula</th>
                      <th className="px-4 py-2">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((alumno) => (
                      <tr key={alumno.id_matricula}>
                        <td className="px-4 py-2">{alumno.id_alumno.apellido}</td>
                        <td className="px-4 py-2">{alumno.id_alumno.nombre}</td>
                        <td className="px-4 py-2">{alumno.id_alumno.cedula}</td>
                        <td className="px-4 py-2">{alumno.id_alumno.telefono}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={downloadAsSVG}
                  className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md mr-2"
                >
                  Descargar SVG
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400 py-2 px-4 rounded-md mr-2"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlumnosListModal;
