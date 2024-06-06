import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAlumnos,
  searchAlumnos,
  getMatricula,
  getGrados,
} from "../services/AcademicoService";
import PaginationButtons from "./PaginationButtons"; // Importar el componente de paginación
import { Table, Label, Select, TextInput, Button } from "flowbite-react";
import { MdSearch } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import * as XLSX from "xlsx";
import { FaFileDownload } from "react-icons/fa";

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
        const res = await getMatricula(anio, gradoId, "", page); // Pasar la página a la función de solicitud

        setAlumnos(res.data.results.map((alumno) => alumno.id_alumno));
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        console.error("Error al filtrar los alumnos por grado:", error);
      }
    } else {
      // Si no se selecciona ningún grado, cargar todos los alumnos nuevamente
      loadAlumnos();
      setCurrentPage(0);
    }
  };

  const loadAlumnos = async () => {
    const page = Math.min(currentPage + 1, totalPages);
    const res = await getAlumnos(page);
    setAlumnos(res.data.results); // Inicializar la lista de alumnos
    setLoading(false);
    setTotalPages(Math.ceil(res.data.count / 10));
  };

  useEffect(() => {
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

  const handleSearch = async (e) => {
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

  const exportAlumnos = async () => {
    try {
      let allAlumnos = [];

      // Si se ha seleccionado un grado, obtén todos los alumnos de ese grado
      if (selectedGrado) {
        const anio = new Date().getFullYear();
        const res = await getMatricula(
          anio,
          selectedGrado,
          "",
          currentPage + 1
        );
        allAlumnos = res.data.results.map((alumno) => alumno.id_alumno);
      } else {
        // Si no se ha seleccionado un grado, obtén todos los alumnos
        const res = await getAlumnos();
        allAlumnos = res.data;
      }

      const data = allAlumnos.map((alumno) => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        Cedula: alumno.cedula,
        "Fecha de Nacimiento": alumno.fecha_nac,
        Teléfono: alumno.telefono,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Alumnos");
      XLSX.writeFile(wb, "alumnos.xlsx");
    } catch (error) {
      console.error("Error al exportar los alumnos:", error);
    }
  };

  const blueColor = "#3B82F6";

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-4xl font-bold">
          <PiStudentBold style={{ color: blueColor }} />
          <h1 className="text-lg">ALUMNOS</h1>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row gap-3">
          <Label className="mr-2">
            Busqueda
            <TextInput
              icon={MdSearch}
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e);
              }}
              placeholder="Buscar Alumno..."
            />
          </Label>
          <Label htmlFor="grado" className="mr-2">
            Grado
            <Select
              value={selectedGrado || ""}
              name="grado"
              onChange={handleGradoChange}
            >
              <option value="">Seleccionar Grado</option>
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nombre}
                </option>
              ))}
            </Select>
          </Label>
        </div>
        <Button
          className="flex flex-wrap bg-blue-500 self-end"
          onClick={exportAlumnos}
        >
          <FaFileDownload className="mr-2 h-5 w-5" />
          Descargar
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <Table.Head className="bg-gray-100">
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Apellido</Table.HeadCell>
            <Table.HeadCell>Cedula</Table.HeadCell>
            <Table.HeadCell>Fecha de Nacimiento</Table.HeadCell>
            <Table.HeadCell>Teléfono</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Acciones</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {alumnos.map((alumno) => (
              <Table.Row
                key={alumno.id_alumno}
                className="hover:bg-gray-100"
              >
                <Table.Cell>{alumno.nombre}</Table.Cell>
                <Table.Cell>{alumno.apellido}</Table.Cell>
                <Table.Cell>{alumno.cedula}</Table.Cell>
                <Table.Cell>{alumno.fecha_nac}</Table.Cell>
                <Table.Cell>{alumno.telefono}</Table.Cell>
                <Table.Cell>
                  <Link to={`/alumnos/${alumno.id_alumno}`}>
                    <BiEdit
                      className="text-2xl"
                      style={{ color: blueColor }}
                      title="Editar"
                    />
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <PaginationButtons
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
      />
    </div>
  );
};


export default ResponsablesList;
