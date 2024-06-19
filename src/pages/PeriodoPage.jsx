import { useEffect, useState } from "react";
import AgregarPeriodoModal from "../components/AgregarPeriodoModal";
import { Button, Table } from "flowbite-react";
import { RiFileList3Line } from "react-icons/ri";
import { FaPlus, FaToggleOff, FaToggleOn } from "react-icons/fa";
import {
  getPeriodo,
  updatePeriodo,
  createPeriodo,
} from "../services/AcademicoService";
import toast from "react-hot-toast";
import PaginationButtons from "../components/PaginationButtons";
import DesmatricularModal from "../components/matriculacion/Desmatricular";

function PeriodoPage() {
  const [reload, setReload] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const defaultData = {
    id_periodo: "",
    periodo: "",
    fecha_inicio: "",
    fecha_fin: "",
    vencimiento_pagos: "",
    es_activo: false,
  };
  const [periodo, setPeriodo] = useState(defaultData);
  const [periodoList, setPeriodoList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showActivate, setShowActivate] = useState(false);

  useEffect(() => {
    const loadPeriodos = async () => {
      const page = Math.min(currentPage + 1, totalPages);
      try {
        const res = await getPeriodo();
        setPeriodoList(res.data);
        setTotalPages(Math.ceil(res.data.length / 10));
      } catch (error) {
        toast.error("Error al cargar la pagina");
        console.log(error);
      }
    };
    loadPeriodos();
  }, [reload, currentPage]);

  const handleEditPeriodo = (prd) => {
    setPeriodo(prd);
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
    setPeriodo(defaultData);
    setReload(!reload);
  };

  const handleActivate = async () => {
    try {
      const res = await updatePeriodo(periodo.id_periodo, {
        es_activo: !periodo.es_activo,
      });
      if (res.data.es_activo) {
        await deactivateOtherPeriodos(periodo.id_periodo);
      }
      toast.success("Periodo Actualizado");
      setReload(!reload);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
    onCloseActivate();
  };

  const deactivateOtherPeriodos = async (currentId) => {
    try {
      const otherPeriodos = periodoList.filter(
        (prd) => prd.id_periodo !== currentId && prd.es_activo
      );
      for (let prd of otherPeriodos) {
        await updatePeriodo(prd.id_periodo, { es_activo: false });
      }
    } catch (error) {
      console.error("Error al desactivar otros periodos:", error);
    }
  };

  const handleShowActivateModal = (prd) => {
    setPeriodo(prd);
    setShowActivate(true);
  };

  const onCloseActivate = () => {
    setPeriodo(defaultData);
    setShowActivate(false);
  };

  return (
    <>
      <DesmatricularModal
        show={showActivate}
        onClose={() => onCloseActivate()}
        title={periodo?.es_activo ? "Desactivar Periodo" : "Activar Periodo"}
        message={"Confirmar cambio."}
        information={"Periodo: " + periodo?.periodo}
        data={""}
        action={() => handleActivate()}
      />
      <AgregarPeriodoModal
        show={showAddModal}
        onClose={() => handleClose()}
        periodo={periodo}
      />
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <RiFileList3Line className="text-blue-700" />
          <h1 className="">PERIODOS ACADÉMICOS</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap bg-blue-500"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Nuevo Periodo</h1>
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Periodo</Table.HeadCell>
            <Table.HeadCell>Fecha Inicio</Table.HeadCell>
            <Table.HeadCell>Fecha Fin</Table.HeadCell>
            <Table.HeadCell>Vencimiento Pagos</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {periodoList.map((periodo) => (
              <Table.Row
                key={periodo.id_periodo}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4`}
              >
                <Table.Cell>{periodo.id_periodo}</Table.Cell>
                <Table.Cell>{periodo.periodo}</Table.Cell>
                <Table.Cell>{periodo.fecha_inicio}</Table.Cell>
                <Table.Cell>{periodo.fecha_fin}</Table.Cell>
                <Table.Cell>{periodo.vencimiento_pagos}</Table.Cell>
                <Table.Cell
                  className={`${
                    !periodo.es_activo ? "text-red-700" : "text-green-600"
                  }`}
                >
                  {periodo.es_activo ? "Activo" : "Inactivo"}
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-blue-500"
                    onClick={() => handleEditPeriodo(periodo)}
                  >
                    Editar
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-blue-500"
                    onClick={() => handleShowActivateModal(periodo)}
                  >
                    {periodo.es_activo ? (
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default PeriodoPage;
