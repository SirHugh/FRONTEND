import { useEffect, useState } from "react";
import {
  getFlujoCajaCurrent,
  setFlujoCajaActive,
} from "../../services/CajaService";
import toast from "react-hot-toast";
import { Button, Card, Table } from "flowbite-react";
import { CurrencyFormatter } from "../Constants";
import { MdOutlineTableChart } from "react-icons/md";
import { FaPlay, FaStop } from "react-icons/fa";
import AgregarFlujoModal from "./AgregarFlujoModal";
import jsPDF from "jspdf";

function FlujoCaja({ id_flujoCaja }) {
  const [flujo, setFlujo] = useState(null);
  const [reload, setReload] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFlujoCajaCurrent(true);
        setFlujo(res.data);
        console.log(res.data);
      } catch (error) {
        toast.error(error.response.data.error);
      }
    };
    load();
  }, [reload]);

  const handlePrintPDF = (flujoData) => {
    const doc = new jsPDF();
    flujoData.forEach((flujo, index) => {
      const yOffset = index * 80;
      doc.text("Reporte de Flujo de Caja", 10, 10 + yOffset);
      doc.text(`Fecha y hora de apertura: ${flujo.hora_apertura}`, 10, 20 + yOffset);
      doc.text(`Fecha y hora de cierre: ${flujo.hora_cierre || "N/A"}`, 10, 30 + yOffset);
      doc.text(`Monto de apertura: ${CurrencyFormatter(Number(flujo.monto_apertura))}`, 10, 40 + yOffset);
      doc.text(`Monto de cierre: ${CurrencyFormatter(Number(flujo.monto_cierre))}`, 10, 50 + yOffset);
      doc.text(`Ingresos: ${CurrencyFormatter(Number(flujo.entrada))}`, 10, 60 + yOffset);
      doc.text(`Egresos: ${CurrencyFormatter(Number(flujo.salida))}`, 10, 70 + yOffset);
    });
    doc.save("flujo_caja.pdf");
  };

  const handleActivate = async (value) => {


    try {
      await setFlujoCajaActive(flujo.id_flujoCaja, value);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    if (!value) {
      const confirmPrint = window.confirm("¿Deseas imprimir el flujo de caja antes de cerrar?");
      if (confirmPrint) {
        const res = await getFlujoCajaCurrent(true);
        handlePrintPDF([res.data]);
      }
    }

    const message = value ? "Flujo En curso" : "Flujo Cerrado";
    toast.success(message);
    setReload(!reload);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleClose = () => {
    console.log("ModalShow", showModal);
    setShowModal(false);
    setReload(!reload);
  };

  return (
    <>
      <AgregarFlujoModal show={showModal} onClose={() => handleClose()} />
      {!flujo ? (
        <div>
          <Card>
            <p>No hay nada que mostrar</p>
            <Button
              className="flex flex-wrap"
              color="light"
              onClick={() => setShowModal(true)}
            >
              Iniciar un flujo de caja
            </Button>
          </Card>
        </div>
      ) : (
        <div>
          <div
            className={`flex flex-row w-full items-center p-1 gap-2 ${
              flujo.es_activo ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div className="flex w-full justify-center">
              {flujo.es_activo
                ? "El Flujo actual se encuentra activo"
                : "El Flujo actual se encuentra en inactivo"}
            </div>
            <Button
              title="Habilitar Flujo"
              disabled={flujo.es_activo ? true : false}
              className={"border p-0 rounded-sm items-center"}
              onClick={() => handleActivate(true)}
            >
              <FaPlay />
            </Button>
            <Button
              title="Cerrar Flujo"
              disabled={flujo.es_activo ? false : true}
              className={`border p-0 rounded-sm items-center`}
              onClick={() => handleActivate(false)}
            >
              <FaStop />
            </Button>
            <Button className={"border p-0 rounded-sm items-center"}>
              <MdOutlineTableChart />
            </Button>
          </div>

          <div className="grid grid-cols-5 text-slate-500 items-center py-7 gap-5 p-7 font-bold">
            <Card>
              <small className="text-yellow-400">Monto Apertura</small>
              <big className="self-center">
                {CurrencyFormatter(Number(flujo.monto_apertura))}
              </big>
            </Card>
            <Card>
              <small className="text-green-600">Ingreso</small>
              <big className="self-center">
                {CurrencyFormatter(Number(flujo.entrada))}
              </big>
            </Card>
            <Card>
              <small className="text-red-600">Egreso</small>
              <big className="self-center">
                {CurrencyFormatter(Number(flujo.salida))}
              </big>
            </Card>

            <Card>
              <small className="text-cyan-700">Balance</small>
              <big className="self-center">
                {CurrencyFormatter(
                  Number(flujo.monto_cierre) - Number(flujo.salida)
                )}
              </big>
            </Card>
            <Card>
              <small className="text-cyan-700">Saldo Final</small>
              <big className="self-center">
                {CurrencyFormatter(
                  Number(flujo.monto_cierre) - Number(flujo.salida)
                )}
              </big>
            </Card>
          </div>
          <div className="flex flex-col px-16">
            <big className="flex font-bold text-slate-500 justify-center">
              TRANSACCIONES REGISTRADAS
            </big>
            <Table className="">
              <Table.Head>
                <Table.HeadCell>Codigo</Table.HeadCell>
                <Table.HeadCell>Factura</Table.HeadCell>
                <Table.HeadCell>Hora</Table.HeadCell>
                <Table.HeadCell>Monto</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                <Table.Row colSpan={4} className="flex w-full justify-center">
                  ENTRADAS
                </Table.Row>
                {flujo.facturas?.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.id_comprobante}</Table.Cell>
                    <Table.Cell>{item.nro_factura}</Table.Cell>
                    <Table.Cell>{String(item.hora).substring(0, 5)}</Table.Cell>
                    <Table.Cell>
                      {CurrencyFormatter(Number(item.monto))}
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row colSpan={4} className="flex w-full justify-center">
                  SALIDAS
                </Table.Row>
                {flujo.compras?.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.id_compra}</Table.Cell>
                    <Table.Cell>{item.nro_factura}</Table.Cell>
                    <Table.Cell>
                      {String(item.tiempo_alta).substring(11, 16)}
                    </Table.Cell>
                    <Table.Cell>
                      {CurrencyFormatter(Number(item.monto))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export default FlujoCaja;
