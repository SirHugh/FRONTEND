import { info } from "autoprefixer";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useState } from "react";

const DesmatricularModal = ({
  show,
  onClose,
  action,
  title,
  message,
  information,
  data,
}) => {
  const [checked, setChecked] = useState(false);

  const close = () => {
    setChecked(false);
    onClose();
  };

  const handleAction = () => {
    close();
    action();
  };

  return (
    <>
      <Modal dismissible show={show} size="sm" onClose={close} popup>
        <Modal.Header className="p-3">{title}</Modal.Header>
        <Modal.Body className="py-2 border-y space-y-4">
          <div className="mb-2 flex ">
            <h1>{information}</h1>
          </div>
          <div className="flex flex-col gap-2 text-1xl gap-y-5  ">
            <span className="font-medium">{data}</span>
            <div className="flex p-2 gap-4 ">
              <Checkbox
                id="check"
                value={checked}
                onChange={() => setChecked(!checked)}
              />
              <Label htmlFor="check">{message}</Label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex max-h-fit p-3 justify-end">
          <Button disabled={!checked} onClick={handleAction}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DesmatricularModal;
