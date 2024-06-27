import { Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { getActividades } from "../../services/CajaService";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter } from "../Constants";

function DetalleModal({ show, onClose, id_actividad }) {
  const [actividad, setActividad] = useState();

  useEffect(() => {
    if (id_actividad) {
      try {
        getActividades(id_actividad).then((res) => {
          console.log(res.data);
          setActividad(res.data);
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, [id_actividad]);

  return (
    <Modal show={show} onClose={onClose} size={"4xl"}>
      <Modal.Header>Detalle de actividad</Modal.Header>
      <Modal.Body className="flex  flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Label>
            Actividad:
            <TextInput
              readOnly
              className="font-semibold"
              value={actividad?.actividad}
            />
          </Label>
          <Label>
            Fecha:
            <TextInput
              readOnly
              className="font-semibold"
              value={DateFormatter(new Date(actividad?.fecha || null))}
            />
          </Label>
          <Label>
            Grado:
            <TextInput
              readOnly
              className="font-semibold"
              value={actividad?.grado}
            />
          </Label>
          <Label>
            Monto:
            <TextInput
              readOnly
              className="font-semibold"
              value={CurrencyFormatter(parseInt(actividad?.monto))}
            />
          </Label>
        </div>
        <big>
          <b>PAGOS REALIZADOS</b>
        </big>
        <div>
          <Table>
            <Table.Head>
              <Table.HeadCell>Nro.</Table.HeadCell>
              <Table.HeadCell>Alumno</Table.HeadCell>
              <Table.HeadCell>Fecha del pago</Table.HeadCell>
              <Table.HeadCell>Monto</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {actividad?.pagos?.map((alumno, index) => (
                <Table.Row key={alumno.id_alumno} className="hover:bg-gray-100">
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{alumno.alumno}</Table.Cell>
                  <Table.Cell>
                    {DateFormatter(new Date(alumno.fecha_pago))}
                  </Table.Cell>
                  <Table.Cell>
                    {CurrencyFormatter(parseInt(alumno.monto))}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DetalleModal;
