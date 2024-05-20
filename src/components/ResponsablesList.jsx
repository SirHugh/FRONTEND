import React, { useEffect, useState } from "react";
import { getResponsables } from "../services/AcademicoService";
import { Table } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import PaginationButtons from "../components/PaginationButtons"; // Componente de paginación reutilizable
import useAuth from "../hooks/useAuth"; // Hook para manejar autenticación

const ResponsablesList = () => {
  const [responsables, setResponsables] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { authTokens } = useAuth();
  const itemsPerPage = 10; // Número de elementos por página

  useEffect(() => {
    const loadResponsables = async () => {
      try {
        const res = await getResponsables(currentPage + 1, searchTerm); // currentPage + 1 para la paginación 1-based
        if (res.status === 200) {
          setResponsables(res.data.slice(0, itemsPerPage));
          setTotalPages(Math.ceil(res.data.length / itemsPerPage));
        } else {
          console.error("Error al cargar los responsables:", res.message);
        }
      } catch (error) {
        console.error("Error al obtener los responsables:", error);
      }
    };
    loadResponsables();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Resetear a la primera página en una nueva búsqueda
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <h1 className="">RESPONSABLES</h1>
      </div>
      <div className="w-80 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <MdSearch className="size-6" />
            </div>
            <input
              type="search"
              id="search"
              name="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar Cliente..."
              onChange={(e) => {
                handleSearch(e);
              }}
              required
            />
          </div>
      <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Cliente</Table.HeadCell>
            <Table.HeadCell>Alumno</Table.HeadCell>
            <Table.HeadCell>Ocupación</Table.HeadCell>
            <Table.HeadCell>Tipo de Relación</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {responsables.map((responsable) => (
              <Table.Row
                key={responsable.id_responsable}
                className="hover:border-l-blue-500 hover:border-l-4"
              >
                <Table.Cell>{responsable.id_responsable}</Table.Cell>
                <Table.Cell>{responsable.id_cliente.nombre} {responsable.id_cliente.apellido}</Table.Cell>
                <Table.Cell>{responsable.id_alumno.nombre}</Table.Cell>
                <Table.Cell>{responsable.ocupacion}</Table.Cell>
                <Table.Cell>{responsable.tipo_relacion}</Table.Cell>
                <Table.Cell>
                  <BiEdit className="text-2xl" title="Editar" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="mt-4">
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
        />
      </div>
    </div>
  );
};

export default ResponsablesList;
