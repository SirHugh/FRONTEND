import { Button, Label, Modal, Table } from "flowbite-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import GeneratePDF from "./GeneratePDF";
import QRCode from 'qrcode';

const SummaryModal = ({
  show,
  onClose,
  comprobante,
  detalleList,
  organization,
  cliente
}) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const generateQRCode = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePDFGeneration = async () => {
    const qrCode = await generateQRCode("https://your-url.com");
    GeneratePDF(comprobante, detalleList, organization, qrCode, cliente);
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
          Resumen de la Factura
        </Modal.Header>
        <Modal.Body>
          <div ref={componentRef} className="flex flex-col">
            <div className="grid grid-cols-3 gap-2 justify-between p-3">
              <Label>
                ID Comprobante: <b>{comprobante.id_comprobante}</b>
              </Label>
              <Label>
                <big>ID Timbrado:</big> <p>{comprobante.id_timbrado}</p>
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
            </div>
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
                {detalleList.ventas?.map((detalle) => (
                  <Table.Row key={detalle.id_venta}>
                    <Table.Cell> {detalle.id_venta}</Table.Cell>
                    <Table.Cell> {detalle.alumno}</Table.Cell>
                    <Table.Cell> {detalle.descripcion.map(d => d.producto).join(", ")}</Table.Cell>
                    <Table.Cell> {detalle.fecha_vencimiento}</Table.Cell>
                    <Table.Cell> {detalle.nro_pago}</Table.Cell>
                    <Table.Cell> {detalle.monto}</Table.Cell>
                    <Table.Cell> {detalle.es_activo ? "Si" : "No"}</Table.Cell>
                  </Table.Row>
                ))}
                {detalleList.actividades?.map((detalle) => (
                  <Table.Row key={detalle.id_pagoActividad}>
                    <Table.Cell> {detalle.id_pagoActividad}</Table.Cell>
                    <Table.Cell> {detalle.alumno}</Table.Cell>
                    <Table.Cell> {detalle.actividad}</Table.Cell>
                    <Table.Cell> {detalle.fecha_pago}</Table.Cell>
                    <Table.Cell> {detalle.monto}</Table.Cell>
                    <Table.Cell> {detalle.es_activo ? "Si" : "No"}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="button" onClick={handlePDFGeneration}>
            Generar PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SummaryModal;
