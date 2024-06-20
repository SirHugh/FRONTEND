import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { DateFormatter, TimeFormatter } from "../Constants";
import { createFlujoCaja } from "../../services/CajaService";
import toast from "react-hot-toast";

function AgregarFlujoModal({ show, onClose }) {
  const { user } = useAuth();
  const [montoApertura, setMontoApertura] = useState(0);
  const date = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Comfirmar los datos de apertura de caja?")) {
      toast.error("Operacion Cancelada");
      return;
    }
    try {
      await createFlujoCaja({
        id_usuario: user.user_id,
        monto_apertura: montoApertura,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
    toast.success("Flujo de caja Iniciado Exitosamente");
  };

  const close = () => {
    setMontoApertura(0);
    onClose();
  };
  return (
    <>
      <Modal show={show} onClose={close} size={"md"} popup>
        <Modal.Header className="p-5">
          <big>Nuevo Flujo de Caja</big>
        </Modal.Header>
        <Modal.Body>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
              <Label>
                Fecha
                <TextInput type="text" value={DateFormatter(date)} readOnly />
              </Label>
              <Label>
                Hora
                <TextInput
                  type="text"
                  value={TimeFormatter(date.getTime())}
                  readOnly
                />
              </Label>
              <Label>
                Monto De Apertura <c className="text-red-700">*</c>
                <TextInput
                  type="number"
                  name="montoApertura"
                  value={montoApertura}
                  min={50}
                  onChange={(e) => setMontoApertura(e.target.value)}
                  required
                />
              </Label>
              <Button type="submit">Guardar</Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AgregarFlujoModal;
