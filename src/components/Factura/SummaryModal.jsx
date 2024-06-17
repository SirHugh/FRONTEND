import jsPDF from "jspdf";
import { Button, Label, Modal, Table } from "flowbite-react";

const SummaryModal = ({ show, onClose, comprobante, detalleList }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handlePrintAsPdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    const modalContent = document.getElementById("modal-content");
    // doc.HTML(modalContent.innerHTML, 15, 15);
    // doc.save("comprobante.pdf");
    doc.html(modalContent.innerHTML, {
      async callback(doc) {
        await doc.save("document");
      },
    });
  };

  return (
    <>
      <Modal
        show={show}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Modal.Header id="modal-modal-title">
          Resumen del Comprobante
        </Modal.Header>
        <Modal.Body className="grid grid-cols-3" id="modal-content">
          <Label>
            ID Comprobante: <p>{comprobante.id_comprobante}</p>
          </Label>
          <Label>
            ID Timbrado: <p>{comprobante.id_timbrado}</p>
          </Label>
          <Label>
            Nro Factura: <p>{comprobante.nro_factura}</p>
          </Label>
          <Label>
            ID Usuario: <p>{comprobante.id_user}</p>
          </Label>
          <Label>
            ID Cliente: <p>{comprobante.id_cliente}</p>
          </Label>
          <Label>
            Fecha: <p>{comprobante.fecha}</p>
          </Label>
          <Label>
            Tipo de Pago:{" "}
            <p>{comprobante.tipo_pago === "C" ? "Contado" : ""}</p>
          </Label>
          <Label>
            Monto: <p>{comprobante.monto}</p>
          </Label>
          <Label id="modal-modal-title" variant="h6" component="h2">
            Detalles del Pago
          </Label>
          <Table>
            <Table.Head></Table.Head>
            <Table.Body>
              {detalleList.aranceles?.map((detalle) => (
                <Table.Row key={detalle.id_arancel}>
                  <Table.Cell> {detalle.id_arancel}</Table.Cell>
                  <Table.Cell> {detalle.alumno}</Table.Cell>
                  <Table.Cell> {detalle.nombre}</Table.Cell>
                  <Table.Cell> {detalle.fecha_vencimiento}</Table.Cell>
                  <Table.Cell> {detalle.nro_cuota}</Table.Cell>
                  <Table.Cell> {detalle.monto}</Table.Cell>
                  <Table.Cell> {detalle.es_activo ? "Si" : "No"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={handlePrintAsPdf}>
            Print as PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SummaryModal;
