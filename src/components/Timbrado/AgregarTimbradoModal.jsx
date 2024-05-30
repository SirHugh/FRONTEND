import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactInputMask from "react-input-mask";

function AgregarTimbradoModal({ show, onClose, edit, timbrado }) {
  const [formData, setFormData] = useState(
    timbrado || {
      nro_timbrado: "",
      fecha_desde: "",
      fecha_hasta: "",
      es_activo: false,
      numero_inicial: "",
      numero_final: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <Modal show={show} onClose={onClose} size={"md"} popup>
      <Modal.Header>Agregar Timbrado</Modal.Header>
      <Modal.Body>
        <div>
          <Label>
            Numero de Timbrado
            <TextInput
              name="nro_timbrado"
              value={formData.nro_timbrado}
              onChange={(e) => handleChange(e)}
            />
          </Label>
          <Label>
            Fecha de Inicio
            <TextInput
              type="date"
              name="fecha_desde"
              value={formData.fecha_desde}
              onChange={(e) => handleChange(e)}
            />
          </Label>
          <Label>
            validez(hasta)
            <TextInput
              type="date"
              name="fecha_hasta"
              value={formData.fecha_hasta}
              onChange={(e) => handleChange(e)}
            />
          </Label>
          <Label>
            Primer numero:
            <ReactInputMask
              className="flex w-full border border-x-gray-400 rounded-lg p-2"
              name="numero_inicial"
              value={formData.numero_inicial}
              onChange={(e) => handleChange(e)}
              mask="999-999-9999999"
              placeholder="000-000-0000000"
            />
          </Label>

          <Label>
            Ultimo numero:
            <ReactInputMask
              className="flex w-full border border-x-gray-400 rounded-lg p-2"
              name="numero_final"
              value={formData.numero_final}
              onChange={(e) => handleChange(e)}
              mask="999-999-9999999"
              placeholder="000-000-0000000"
            />
          </Label>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button onClick={handleSubmit} disabled>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AgregarTimbradoModal;
