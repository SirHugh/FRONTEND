import React, { useState, useEffect } from "react";
import { Table, Button } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import PaginationButtons from "../PaginationButtons";
import ArancelModal_ from "../ArancelModal_";
import ProductoModal from "../ProductoModal";
import { getArancel, createArancel, updateArancel } from "../../services/CajaService";
import { FaPlus } from "react-icons/fa";

const ArancelesTab = () => {
  const [aranceles, setAranceles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedArancel, setSelectedArancel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadAranceles = async () => {
      try {
        const res = await getArancel(true, null, null, currentPage, "");
        if (res.status === 200) {
          setAranceles(res.data.results || []); // Asegúrate de que siempre es una matriz
          setTotalPages(Math.ceil(res.data.count / itemsPerPage));
        } else {
          console.error("Error al cargar los aranceles:", res.message);
        }
      } catch (error) {
        console.error("Error al obtener los aranceles:", error);
      }
    };
    loadAranceles();
  }, [currentPage]);

  const handleSave = async (arancel) => {
    try {
      if (selectedArancel) {
        await updateArancel(selectedArancel.id_arancel, arancel);
      } else {
        await createArancel(arancel);
      }
      setShowModal(false);
      const res = await getArancel(true, null, null, currentPage, "");
      setAranceles(res.data.results || []);
    } catch (error) {
      console.error("Error al guardar el arancel:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <h1 className="">ARANCELES</h1>
      </div>
      <div className="flex flex-row justify-end h-16 p-3 gap-3 items-center">
        <Button
          className="flex flex-wrap bg-blue-500"
          onClick={() => { setSelectedArancel(null); setShowModal(true); }}
        >
          <FaPlus className="mr-2 h-5 w-5" />
          <h1>Agregar Arancel</h1>
        </Button>
      </div>
      <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Matricula</Table.HeadCell>
            <Table.HeadCell>Producto</Table.HeadCell>
            <Table.HeadCell>Comprobante</Table.HeadCell>
            <Table.HeadCell>Fecha Vencimiento</Table.HeadCell>
            <Table.HeadCell>Nro Cuota</Table.HeadCell>
            <Table.HeadCell>Monto</Table.HeadCell>
            <Table.HeadCell>Activo</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {aranceles && aranceles.length > 0 ? (
              aranceles.map((arancel) => (
                <Table.Row
                  key={arancel.id_arancel}
                  className="hover:border-l-blue-500 hover:border-l-4"
                >
                  <Table.Cell>{arancel.id_arancel}</Table.Cell>
                  <Table.Cell>{arancel.id_matricula}</Table.Cell>
                  <Table.Cell>{arancel.id_producto}</Table.Cell>
                  <Table.Cell>{arancel.id_comprobante}</Table.Cell>
                  <Table.Cell>{arancel.fecha_vencimiento}</Table.Cell>
                  <Table.Cell>{arancel.nro_cuota}</Table.Cell>
                  <Table.Cell>{arancel.monto}</Table.Cell>
                  <Table.Cell>{arancel.es_activo ? "Sí" : "No"}</Table.Cell>
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
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="9">No hay aranceles disponibles</Table.Cell>
              </Table.Row>
            )}
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
          arancel={selectedArancel}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ArancelesTab;
