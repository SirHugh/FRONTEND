import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAlumnos } from "../services/AcademicoService";
import EditButton from "./Buttons/EditButton";
import SeeButton from "./Buttons/SeeButton";
import PaginationButtons from "./PaginationButtons"; // Importar el componente de paginación
import App from "../../multi-step-form-inscription/src/App";

export const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAlumnoForm, setShowAlumnoForm] = useState(false);
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [showResponsableForm, setShowResponsableForm] = useState(false);
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const history = useNavigate();

  const handleToggleModal = () => {
    setShowInscriptionForm(!showInscriptionForm);
  };

  useEffect(() => {
    async function loadAlumnos() {
      const page = Math.min(currentPage + 1, totalPages);
      const res = await getAlumnos(page);
      console.log("Datos recibidos del alumno: " + JSON.stringify(res));

      setAlumnos(res.data.results);
      setLoading(false);
      setTotalPages(Math.ceil(res.data.count / 10));
    }
    loadAlumnos();
  }, [currentPage]);

  const handleAddAlumno = () => {
    const url = "/academico";
    history(url);
    console.log("Agregar nuevo alumno");
    setShowInscriptionForm(true);
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumno.apellido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumno.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumno.cedula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumno.fecha_nac}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumno.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/alumnos/${alumno.id_alumno}`}>
                      <EditButton />
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
      </div>
    </div>
  );
};
