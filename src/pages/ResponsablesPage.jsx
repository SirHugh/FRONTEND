import React, { useEffect, useState } from "react";
import { searchResponsables } from "../services/AcademicoService";
import { Breadcrumb, Table } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import { MdSearch } from "react-icons/md";
import PaginationButtons from "../components/PaginationButtons";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import ClienteResponsableForm from "../components/ClienteResponsableForm";
import { getCliente } from "../services/CajaService";

const ResponsablesPage = () => {
  const [responsables, setResponsables] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const { authTokens } = useAuth();
  const itemsPerPage = 10;

  useEffect(() => {
    const loadResponsables = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages);
        const res = await getCliente("", searchTerm, page);
        console.log(res.data.results);
        setResponsables(res.data.results);
        setTotalPages(Math.ceil(res.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error al obtener los responsables:", error);
      }
    };
    loadResponsables();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleEditClick = (responsable) => {
    setSelectedResponsable(responsable);
  };

  const handleCloseModal = () => {
    setSelectedResponsable(null);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg pt-2 px-5">
      {selectedResponsable && (
        <ClienteResponsableForm
          responsable={selectedResponsable}
          onClose={handleCloseModal}
          show={true}
        />
      )}
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
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar Cliente..."
          onChange={handleSearch}
          required
        />
      </div>
      <div className="overflow-x-auto w-full border mt-4 rounded-lg px2 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Cedula / RUC</Table.HeadCell>
            <Table.HeadCell>Telefono</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Dirección</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {responsables.length > 0 ? (
              responsables.map((responsable) => (
                <Table.Row
                  key={responsable.id_responsable}
                  className="hover:border-l-blue-500 hover:border-l-4"
                >
                  <Table.Cell>
                    {responsable.nombre} {responsable.apellido}
                  </Table.Cell>
                  <Table.Cell>
                    {responsable.cedula}

                    {responsable.ruc ? "/ [" + responsable.ruc + "]" : ""}
                  </Table.Cell>
                  <Table.Cell>{responsable.telefono}</Table.Cell>
                  <Table.Cell>{responsable.email}</Table.Cell>
                  <Table.Cell>{responsable.direccion}</Table.Cell>
                  <Table.Cell>
                    <BiEdit
                      className="text-2xl cursor-pointer"
                      title="Editar"
                      onClick={() => handleEditClick(responsable)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={8} className="text-center">
                  No hay responsables disponibles
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
      <div className="mt-4">
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ResponsablesPage;
