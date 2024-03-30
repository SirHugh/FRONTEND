import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getAlumnos } from "../services/AcademicoService";
import  EditButton  from "./Buttons/EditButton";
import SeeButton from "./Buttons/SeeButton";
import AlumnoForm from "./AlumnoForm"; // Importar el componente AlumnoForm
import PaginationButtons from "./PaginationButtons"; // Importar el componente de paginación

export const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAlumnoForm, setShowAlumnoForm] = useState(false);

  const handleToggleModal = () => {
    setShowAlumnoForm(!showAlumnoForm);
  };

  useEffect(() => {
    async function loadAlumnos() {
      const page = Math.min(currentPage + 1, totalPages);
      const res = await getAlumnos(page);
      console.log("Datos recibidos del alumno: "+JSON.stringify(res));

      setAlumnos(res.data.data);
      setLoading(false);
      setTotalPages(res.data.number_of_pages);
    }
    loadAlumnos();
  }, [currentPage]);

  const handleAddAlumno = () => {
    console.log("Agregar nuevo alumno");
    setShowAlumnoForm(true);
  };

  // Función para manejar la adición de un nuevo alumno

  const filteredAlumnos = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="w-full max-w-8xl flex justify-left mb-2">
          <input
            type="text"
            placeholder="Buscar alumno"
            className="border border-gray-300 rounded-md px-4 py-2 w-64 mr-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <div className="overflow-x-auto w-full max-w-12xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Cedula
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Nacimiento
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlumnos.map((alumno) => (
              <tr key={alumno.id_alumno}>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.fecha_nac}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <EditButton onClick={() => handleEdit(alumno.id_alumno)} />
                  <Link to={`/alumnos/${alumno.id_alumno}`}>
                      <SeeButton />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
      <PaginationButtons
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
      />

      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddAlumno}
        >
          Añadir Alumno
        </button>
        {showAlumnoForm && <AlumnoForm onClose={handleToggleModal} />}
      </div>
    </div>
    </div>
  );
};