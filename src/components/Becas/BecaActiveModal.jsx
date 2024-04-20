import { Button, Label, Modal, Radio } from "flowbite-react";
import { useState } from "react";
import { setBecaActive } from "../../services/AcademicoService";

const BecaActiveModal = ({
  show,
  onClose,
  beca,
  setBeca,
  changed,
  setChanged,
}) => {
  const [DisableButton, setDisableButton] = useState(true);

  const onCloseModal = () => {
    setDisableButton(true);
    onClose();
  };

  const activateBeca = async () => {
    try {
      // Enviamos los datos de la nueva beca al servidor
      await setBecaActive(beca.id_beca, beca.es_activo);
      onCloseModal();
      setChanged(!changed);
      return 0;
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
  };

  return (
    <>
      <Modal dismissible show={show} size="lg" onClose={onCloseModal} popup>
        <Modal.Header className="p-3"> {beca.nombre}</Modal.Header>
        <Modal.Body className="py-6 border-y space-y-4">
          <Label htmlFor="activar" value="Activo" />
          <fieldset
            id="activar"
            name="activar"
            className="flex max-w-md flex-col gap-4 px-4"
          >
            <div className="flex items-center gap-3">
              <Radio
                id="no"
                name="no"
                checked={!beca.es_activo}
                onChange={() => {
                  setBeca({
                    ...beca,
                    ["es_activo"]: false,
                  });
                  setDisableButton(false);
                }}
              />
              <Label htmlFor="no">NO</Label>
            </div>
            <div className="flex items-center gap-3">
              <Radio
                id="si"
                name="si"
                checked={beca.es_activo}
                onChange={() => {
                  setBeca({
                    ...beca,
                    ["es_activo"]: true,
                  });
                  setDisableButton(false);
                }}
              />
              <Label htmlFor="si">SI</Label>
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button disabled={DisableButton} onClick={() => activateBeca()}>
            Guardar Cambio
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BecaActiveModal;
