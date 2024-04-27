import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAlumnos, searchAlumnos, getMatriculaAnioGrado, getGrados, getGradoById } from "../services/AcademicoService";
import PaginationButtons from "./PaginationButtons"; // Importar el componente de paginación
import { Table } from "flowbite-react";
import { MdSearch } from "react-icons/md";
import { SiQuicklook } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";

export const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [grados, setGrados] = useState([]); // Estado para almacenar los grados
  const [selectedGrado, setSelectedGrado] = useState(null); // Estado para almacenar el grado seleccionado

  const handleGradoChange = async (e) => {
    const gradoId = e.target.value;
    setSelectedGrado(gradoId); // Actualizar el estado del grado seleccionado
  
    if (gradoId) {
      // Si se selecciona un grado válido, filtrar los alumnos por ese grado
      try {
        const anio = new Date().getFullYear(); // Obtener el año actual
        const page = currentPage + 1; // Ajustar la página a partir de currentPage
        const res = await getMatriculaAnioGrado(anio, gradoId, page); // Pasar la página a la función de solicitud

        setAlumnos(res.data.results.map(alumno => alumno.id_alumno));
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        console.error("Error al filtrar los alumnos por grado:", error);
      }
    } else {
      // Si no se selecciona ningún grado, cargar todos los alumnos nuevamente
      setCurrentPage(0);
    }
  };
  
  useEffect(() => {
    async function loadAlumnos() {
      const page = Math.min(currentPage + 1, totalPages);
      const res = await getAlumnos(page);
      setAlumnos(res.data.results); // Inicializar la lista de alumnos
      setLoading(false);
      setTotalPages(Math.ceil(res.data.count / 10));
    }
    loadAlumnos();
  }, [currentPage]);

  useEffect(() => {
    async function fetchGrados() {
      try {
        // Obtener la lista de grados disponibles
        const res = await getGrados();
        setGrados(res.data); // Almacenar la lista de grados en el estado
      } catch (error) {
        console.error("Error al obtener los grados:", error);
      }
    }
    fetchGrados();
  }, []);

  const handdleSearch = async (e) => {
    try {
      const res = await searchAlumnos(1, e.target.value);
      if (res.status === 200) {
        setTotalPages(Math.ceil(res.data.count / 10));
        setAlumnos(res.data.results);
      }
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
  };

  return (
    <div className="w-full  mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <PiStudentBold className="text-cyan-600" />
        <h1 className="">ALUMNOS</h1>
      </div>
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="flex w-full p-3">
          <div className="w-80 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <MdSearch className="size-6" />
            </div>
            <input
              type="search"
              id="search"
              name="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar Alumno..."
              onChange={(e) => {
                handdleSearch(e);
              }}
              required
            />
          </div>
          <div className="w-80 relative">
            <select
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedGrado || ""}
              onChange={handleGradoChange}
            >
              <option value="">Seleccionar Grado</option>
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto w-full px-10 max-w-12xl bg-slate-300">
          <Table className=" divide-y ">
            <Table.Head className="bg-gray-500">
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Apellido</Table.HeadCell>
              <Table.HeadCell>Cedula</Table.HeadCell>
              <Table.HeadCell>Fecha de Nacimiento</Table.HeadCell>
              <Table.HeadCell>Teléfono</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Acciones</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="bg-white divide-y ">
              {alumnos.map((alumno) => (
                <Table.Row
                  key={alumno.id_alumno}
                  className="hover:border-l-cyan-700 hover:border-l-4"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {alumno.nombre}
                  </Table.Cell>
                  <Table.Cell>{alumno.apellido}</Table.Cell>
                  <Table.Cell>{alumno.cedula}</Table.Cell>
                  <Table.Cell>{alumno.fecha_nac}</Table.Cell>
                  <Table.Cell>{alumno.telefono}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/alumnos/${alumno.id_alumno}`}>
                      <SiQuicklook className="text-cyan-700 text-2xl" />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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
