import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAlumnos, searchAlumnos } from "../services/AcademicoService";
import { Avatar, Table } from "flowbite-react";
import { MdSearch } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import * as XLSX from "xlsx";
import PaginationButtons from "../components/PaginationButtons";

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const loadAlumnos = async () => {
    const page = Math.min(currentPage + 1, totalPages);
    const res = await getAlumnos(page);
    setAlumnos(res.data.results); // Inicializar la lista de alumnos
    setTotalPages(Math.ceil(res.data.count / 10));
  };

  useEffect(() => {
    loadAlumnos();
  }, [currentPage]);

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

  const blueColor = "#3B82F6";

  return (
    <div className="w-full  mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <PiStudentBold style={{ color: blueColor }} />
        <h1 className="">ALUMNOS</h1>
      </div>
      <div className="flex flex-col items-center justify-center mb-2">
        <div className="flex w-full p-4">
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
        </div>
        <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
          <Table className=" divide-y ">
            <Table.Head className="bg-gray-500">
              <Table.HeadCell>
                <span className="sr-only">Foto</span>
              </Table.HeadCell>
              <Table.HeadCell>Cedula</Table.HeadCell>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Apellido</Table.HeadCell>
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
                  className="hover:border-l-blue-500 hover:border-l-4"
                >
                  <Table.Cell>
                    <Avatar img={alumno.fotocarnet} />
                  </Table.Cell>
                  <Table.Cell>{alumno.cedula}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {alumno.nombre}
                  </Table.Cell>
                  <Table.Cell>{alumno.apellido}</Table.Cell>
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
}
