import { Button, Modal } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SummaryModal = ({
  show,
  onClose,
  handleSubmit,
  comprobante,
  detalleList,
  organization,
  cliente,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const newComprobanteId = await handleSubmit(); // Espera la respuesta de handleSubmit
      console.log("Datos del comprobante:", newComprobanteId);
      if (newComprobanteId) {
        navigate(`/printFactura/${newComprobanteId}`);
      } else {
        toast.error("Error al obtener el ID del comprobante.");
      }
    } catch (error) {
      toast.error("Error al crear la factura.");
      console.error("Error al crear la factura:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>Confirmación de Registro</Modal.Header>
      <Modal.Body>
        <p>¿Está seguro de que desea registrar esta factura?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleConfirm} disabled={isSubmitting}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SummaryModal;