import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useState } from "react";
import { updateUser } from "../../services/AuthService";
import toast from "react-hot-toast";

const ActivateUserModal = ({ show, onClose, user, reload, setReload }) => {
  const [checked, setChecked] = useState(false);

  const activateUser = async () => {
    try {
      await updateUser(user.id, {
        user: { is_active: !user.is_active },
        groups: user.groups,
      });
      setChecked(false);
      setReload(!reload);
      onClose();
      toast.success("Cambio realizado exitosamente");
    } catch (error) {
      console.log("error", error);
      toast.error("Error al realizar el cambio");
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
          {user?.is_active ? "Desactivar " : "Activar "}
          {" Usuario"}
        </Modal.Header>
        <Modal.Body className="py-6 border-y space-y-4">
          {/* <div className="mb-2 flex justify-center">
            <h1>
              {user?.is_active ? "¿Desacticar" : "¿Activar"}
              {" Usuario"}
            </h1>
          </div> */}
          <div className="flex flex-col gap-2 text-1xl items-center justify-center">
            <div className="flex p-2 gap-4 ">
              <Checkbox
                id="promotion"
                value={checked}
                onChange={() => setChecked(!checked)}
              />
              <Label htmlFor="promotion">
                ¿Cofirma que desea{" "}
                {user?.is_active ? "Desactivar " : "Activar "} la cuenta del
                siguiente usuario?.
              </Label>
            </div>
            <span className="font-bold items-center justify-center">
              {user.nombre} {user.apellido}
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button disabled={!checked} onClick={() => activateUser()}>
            Guardar Cambio
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActivateUserModal;
