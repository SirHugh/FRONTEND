import { useEffect, useState } from "react";
import AgregarTimbradoModal from "../components/Timbrado/AgregarTimbradoModal";
import { Button, Table } from "flowbite-react";
import { RiFileList3Line } from "react-icons/ri";
import { FaPlus, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { getTimbrado, updateTimbrado } from "../services/CajaService";
import toast from "react-hot-toast";
import PaginationButtons from "../components/PaginationButtons";
import { formatNumber } from "../components/Constants";
import DesmatricularModal from "../components/matriculacion/Desmatricular";

function TimbradoPage() {
  const [reload, setReload] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const defaultData = {
    id_timbrado: "",
    nro_timbrado: "",
    fecha_desde: "",
    fecha_hasta: "",
    es_activo: false,
    establecimiento: "",
    punto_expedicion: "",
    numero_inicial: "",
    numero_final: null,
  };
  const [timbrado, setTimbrado] = useState(defaultData);
  const [timbradoList, setTimbradoList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showActivate, setShowActivate] = useState(false);

  useEffect(() => {
    const loadTimbrados = async () => {
      const page = Math.min(currentPage + 1, totalPages);
      try {
        const res = await getTimbrado(page);

        setTimbradoList(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        toast.error("Error al cargar la pagina");
        console.log(error);
      }
    };
    loadTimbrados();
  }, [reload]);

  const handleEditTimbrado = (tmb) => {
    setTimbrado(tmb);
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setTimbrado(defaultData);
    setReload(!reload);
  };

  const handleActivate = async () => {
    try {
      const res = await updateTimbrado(timbrado.id_timbrado, {
        es_activo: !timbrado.es_activo,
      });
      console.log(res);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
    onCloseActivate();
  };

  const handleShowActivateModal = (tmb) => {
    setTimbrado(tmb);
    setShowActivate(true);
  };

  const onCloseActivate = () => {
    setTimbrado(defaultData);
    setShowActivate(false);
    setReload(!reload);
  };

  return (
    <>
      <DesmatricularModal
        show={showActivate}
        onClose={() => onCloseActivate()}
        title={timbrado?.es_activo ? "Desactivar Timbrado" : "Activar Timbrado"}
        message={"Confirmar cambio."}
        information={"Timbrado nro: " + timbrado?.nro_timbrado}
        data={""}
        action={() => handleActivate()}
      />
      <AgregarTimbradoModal
        show={showAddModal}
        onClose={() => handleClose()}
        timbrado={timbrado}
      />
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <RiFileList3Line className="text-blue-700" />
          <h1 className="">TIMBRADOS</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap bg-blue-500 "
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Nuevo Timbrado</h1>
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Numero</Table.HeadCell>
            <Table.HeadCell>Fecha Inicio</Table.HeadCell>
            <Table.HeadCell>Validez</Table.HeadCell>
            <Table.HeadCell>Numeracion Inicial</Table.HeadCell>
            <Table.HeadCell>Numeracion Final</Table.HeadCell>
            <Table.HeadCell>Ultimo Numero</Table.HeadCell>
            <Table.HeadCell>Estado </Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {timbradoList.map((timbrado) => (
              <Table.Row
                key={timbrado.id_timbrado}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{timbrado.id_timbrado}</Table.Cell>

                <Table.Cell>{timbrado.nro_timbrado}</Table.Cell>

                <Table.Cell>{timbrado.fecha_desde}</Table.Cell>

                <Table.Cell>{timbrado.fecha_hasta}</Table.Cell>

                <Table.Cell>
                  {formatNumber(timbrado.establecimiento, 3)}-
                  {formatNumber(timbrado.punto_expedicion, 3)}-
                  {formatNumber(timbrado.numero_inicial, 7)}
                </Table.Cell>
                <Table.Cell>
                  {formatNumber(timbrado.establecimiento, 3)}-
                  {formatNumber(timbrado.punto_expedicion, 3)}-
                  {formatNumber(timbrado.numero_final || 0, 7)}
                </Table.Cell>
                <Table.Cell>{timbrado.ultimo_numero}</Table.Cell>

                <Table.Cell
                  className={`${
                    !timbrado.es_activo ? "text-red-700" : "text-green-600"
                  }`}
                >
                  {timbrado.es_activo ? "Activo" : "Inactivo"}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-blue-500"
                    onClick={() => handleEditTimbrado(timbrado)}
                  >
                    Editar
                  </button>
                  {timbrado.es_activo ? "" : ""}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-blue-500"
                    onClick={() => handleShowActivateModal(timbrado)}
                  >
                    {timbrado.es_activo ? (
                      <FaToggleOn
                        title="Desactivar"
                        className="size-6 text-blue-500"
                      />
                    ) : (
                      <FaToggleOff
                        title="Activar"
                        className="size-6 text-red-800"
                      />
                    )}
                  </button>
                  {timbrado.es_activo ? "" : ""}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
        />
      </div>
    </>
  );
}

export default TimbradoPage;
