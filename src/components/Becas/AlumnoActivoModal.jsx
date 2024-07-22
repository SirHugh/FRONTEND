import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useState } from "react";
import { setActiveBecado } from "../../services/AcademicoService";

const AlumnoSetActiveModal = ({
  show,
  onClose,
  becado,
  changed,
  setChanged,
}) => {
  const [checked, setChecked] = useState(false);

  const quitarBecado = async () => {
    try {
      const res = await setActiveBecado(becado.id, !becado.es_activo, null);
      console.log(res.data);
      setChecked(false);
      setChanged(!changed);
      onClose();
    } catch (error) {
      console.log("error", error);
    }
  };

  const close = () => {
    setChecked(false);
    onClose();
  };
  return (
    <>
      <Modal dismissible show={show} size="lg" onClose={close} popup>
        <Modal.Header className="p-3">
          {becado?.es_activo ? "Remover " : "Activar "}
          {" Beca"}
        </Modal.Header>
        <Modal.Body className="py-6 border-y space-y-4">
          <div className="mb-2 flex justify-center">
            <h1>{becado?.es_activo ? "¿Remover Beca?" : "¿Activar Beca?"}</h1>
          </div>
          <div className="flex flex-col gap-2 text-1xl items-center justify-center">
            <div className="flex p-2 gap-4 ">
              <Checkbox
                id="promotion"
                value={checked}
                onChange={() => setChecked(!checked)}
              />
              <Label htmlFor="promotion">
                ¿Cofirma que desea {becado?.es_activo ? "Remover " : "Activar "}{" "}
                la beca al siguiente estudiante.
              </Label>
            </div>
            <span className="font-bold items-center justify-center">
              {becado?.alumno.nombre} {becado?.alumno.apellido}
              {" - CI: "}
              {becado?.alumno.cedula}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button disabled={!checked} onClick={() => quitarBecado()}>
            Guardar Cambio
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlumnoSetActiveModal;
