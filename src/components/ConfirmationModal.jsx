import { Button, Modal } from "flowbite-react";

const ConfirmationModal = ({
  show,
  title,
  message,
  children,
  onConfirm,
  onCancel,
  size,
}) => {
  return (
    <Modal show={show} onClose={onCancel} popup size={size}>
      <Modal.Header className="bg-blue-500">{title}</Modal.Header>
      <Modal.Body className="pt-3 pb-1">
        <div className="justify-center gap-3">
          <p className="pext-sm text-gray-500">{message}</p>
          {children && <>{children}</>}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex flex-row py-2 justify-between ">
        <Button color="gray" onClick={onConfirm}>
          Confirmar
        </Button>
        <Button color="gray" onClick={onCancel}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
