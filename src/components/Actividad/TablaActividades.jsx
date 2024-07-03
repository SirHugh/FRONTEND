import { Table, Tooltip } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { activateActividad, getActividades } from "../../services/CajaService";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeDropper,
  FaEyeSlash,
  FaRegEye,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa";
import PaginationButtons from "../PaginationButtons";
import { CurrencyFormatter, DateFormatter } from "../Constants";
import DesmatricularModal from "../matriculacion/Desmatricular";
import { FaEyeLowVision } from "react-icons/fa6";
import DetalleModal from "./DetalleModal";

function TablaActividades({ search, grado }) {
  const [actividades, setActividades] = useState([]);
  const [actividad, setActividad] = useState({});
  const [periodos, setPeriodos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showActivate, setShowActivate] = useState(null);
  const [reload, setReload] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getActividades("", grado, "", search, page);
        setTotalPages(Math.ceil(res.data.count / 10));
        setActividades(res.data.results);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    load();
  }, [currentPage, search, grado, reload]);

  const handleShowActivate = (actividad) => {
    setActividad(actividad);
    setShowActivate(true);
  };

  const onCloseActivate = () => {
    setActividad({});
    setShowActivate(false);
  };

  const handleShowDetail = (actividad) => {
    setActividad(actividad);
    setShowDetalle(true);
  };

  const onCloseDetail = () => {
    setActividad({});
    setShowDetalle(false);
  };

  const handleActivate = async () => {
    console.log(actividad);
    try {
      const res = await activateActividad(
        actividad.id_actividad,
        !actividad.es_activo
      );
      console.log(res);
      toast.success("Actividad Actualizada");
      setReload(!reload);
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
    onCloseActivate();
  };

  return (
    <>
      <DetalleModal
        show={showDetalle}
        onClose={onCloseDetail}
        id_actividad={actividad.id_actividad}
      />
      <DesmatricularModal
        show={showActivate}
        onClose={() => onCloseActivate()}
        title={
          actividad?.es_activo ? "Desactivar Actividad" : "Activar Actividad"
        }
        message={"Confirmar cambio."}
        information={
          <>
            <big>Actividad: {actividad?.actividad}</big>
          </>
        }
        data={<big>Grado: {actividad?.grado}</big>}
        action={() => handleActivate()}
      />
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Codigo</Table.HeadCell>
            <Table.HeadCell>Grado</Table.HeadCell>
            <Table.HeadCell>Actividad</Table.HeadCell>
            <Table.HeadCell>Fecha Actividad</Table.HeadCell>
            <Table.HeadCell>Monto</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell className="sr-only"></Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {actividades.map((actividad) => (
              <Table.Row
                key={actividad.id_actividad}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4`}
              >
                <Table.Cell>{actividad.id_actividad}</Table.Cell>
                <Table.Cell>{actividad.grado}</Table.Cell>
                <Table.Cell>{actividad.actividad}</Table.Cell>
                <Table.Cell>
                  {DateFormatter(new Date(actividad.fecha))}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(actividad.monto))}
                </Table.Cell>
                <Table.Cell
                  className={`${
                    !actividad.es_activo ? "text-red-700" : "text-green-600"
                  }`}
                >
                  {actividad.es_activo ? "Activo" : "Inactivo"}
                </Table.Cell>

                <Table.Cell>
                  <button
                    className=""
                    onClick={() => handleShowDetail(actividad)}
                  >
                    <Tooltip content="Ver">
                      <FaRegEye color="dark" className="size-6" />
                    </Tooltip>
                  </button>
                </Table.Cell>
                <Table.Cell>
                  <Tooltip
                    content={actividad.es_activo ? "Desactivar" : "Activar"}
                  >
                    <button
                      className="text-blue-500"
                      onClick={() => handleShowActivate(actividad)}
                    >
                      {actividad.es_activo ? (
                        <FaToggleOn className="size-6 text-blue-500" />
                      ) : (
                        <FaToggleOff className="size-6 text-red-800" />
                      )}
                    </button>
                  </Tooltip>
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

export default TablaActividades;
