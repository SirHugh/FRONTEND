import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import PaginationButtons from "../components/PaginationButtons";
import ProductoModal from "../components/ProductoModal";
import { getArancel, createArancel, updateArancel } from "../services/CajaService";
import { FaPlus } from "react-icons/fa";
import { Button } from "flowbite-react";

const ArancelesPage = () => {
  const [aranceles, setAranceles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("AR");
  const [selectedArancel, setSelectedArancel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadAranceles = async () => {
      try {
        const res = await getArancel(currentPage + 1, searchTerm);
        if (res.status === 200) {
          setAranceles(res.data.slice(0, itemsPerPage));
          setTotalPages(Math.ceil(res.data.length / itemsPerPage));
        } else {
          console.error("Error al cargar los aranceles:", res.message);
        }
      } catch (error) {
        console.error("Error al obtener los aranceles:", error);
      }
    };
    loadAranceles();
  }, [currentPage, searchTerm]);

  const handleSave = async (arancel) => {
    try {
      if (selectedArancel) {
        await updateArancel(selectedArancel.id_arancel, arancel);
      } else {
        console.log("Datos del arancel a guardar: "+JSON.stringify(arancel));
        await createArancel(arancel);
      }
      setShowModal(false);
      const res = await getArancel(currentPage + 1, searchTerm);
      setAranceles(res.data.slice(0, itemsPerPage));
    } catch (error) {
      console.error("Error al guardar el arancel:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <h1 className="">ARANCELES</h1>
      </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3  items-center">
          <div>
            <Button
                  className="flex flex-wrap bg-blue-500"
                  onClick={() => { setSelectedArancel(null); setShowModal(true); }}
                >
                  <FaPlus className="mr-2 h-5 w-5" />
                  <h1>Agregar Arancel</h1>
                </Button>
          </div>
        </div>
      <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Tipo</Table.HeadCell>
            <Table.HeadCell>Stock</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>Activo</Table.HeadCell>
            <Table.HeadCell>Mensual</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {aranceles.map((arancel) => (
              <Table.Row
                key={arancel.id_arancel}
                className="hover:border-l-blue-500 hover:border-l-4"
              >
                <Table.Cell>{arancel.id_arancel}</Table.Cell>
                <Table.Cell>{arancel.nombre}</Table.Cell>
                <Table.Cell>{arancel.descripcion}</Table.Cell>
                <Table.Cell>{arancel.tipo}</Table.Cell>
                <Table.Cell>{arancel.stock}</Table.Cell>
                <Table.Cell>{arancel.precio}</Table.Cell>
                <Table.Cell>{arancel.es_activo ? "Sí" : "No"}</Table.Cell>
                <Table.Cell>{arancel.es_mensual ? "Sí" : "No"}</Table.Cell>
                <Table.Cell>
                  <BiEdit
                    className="text-2xl cursor-pointer"
                    title="Editar"
                    onClick={() => {
                      setSelectedArancel(arancel);
                      setShowModal(true);
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {showModal && (
        <ProductoModal
          producto={selectedArancel}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ArancelesPage;
