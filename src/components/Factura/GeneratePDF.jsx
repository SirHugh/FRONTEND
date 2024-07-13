import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GeneratePDF = (comprobante, aranceles, organization, qrCode) => {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(10);
  doc.text("Colegio Unidos por Cristo", 14, 15);
  doc.setFontSize(8);
  doc.text(organization.direccion, 14, 20);
  doc.text(`Tel.: ${organization.telefono}`, 14, 25);
  doc.text(`RUC: ${organization.ruc}`, 150, 15);
  doc.text(`Nº de Timbrado: ${comprobante.id_timbrado}`, 150, 20);
  doc.text(`FACTURA ELECTRONICA Nº ${comprobante.nro_factura}`, 150, 25);
  doc.text(`Fecha: ${comprobante.fecha}`, 150, 30);

  // Datos del Cliente
  doc.text(`Nombre o Razon Social: ${comprobante.cliente}`, 14, 40);
  doc.text(`Dirección: ${comprobante.direccion_cliente}`, 14, 45);
  doc.text(`Teléfono: ${comprobante.telefono_cliente}`, 14, 50);
  doc.text(`Correo Electrónico: ${comprobante.email_cliente}`, 14, 55);

  // Tabla de detalles
  autoTable(doc, {
    startY: 60,
    head: [['ID ARANCEL', 'ALUMNO', 'NOMBRE', 'FECHA VENCIMIENTO', 'NRO CUOTA', 'MONTO']],
    body: aranceles.map(arancel => [
      arancel.id_arancel,
      arancel.alumno,
      arancel.nombre,
      arancel.fecha_vencimiento,
      arancel.nro_cuota,
      arancel.monto
    ]),
  });

  // Subtotales y Totales
  doc.text(`SUBTOTAL: ${comprobante.monto}`, 150, doc.autoTable.previous.finalY + 10);
  doc.text(`TOTAL A PAGAR: ${comprobante.monto}`, 150, doc.autoTable.previous.finalY + 20);

  // Comentarios
  doc.setFontSize(8);
  doc.text("Este documento es una representación gráfica de un documento electrónico (XML)", 14, doc.autoTable.previous.finalY + 40);
  
  // Agregar QR
  if (qrCode) {
    const img = new Image();
    img.src = qrCode;
    doc.addImage(img, 'PNG', 14, doc.autoTable.previous.finalY + 50, 50, 50);
  }

  doc.save(`Factura_${comprobante.nro_factura}.pdf`);
};

export default GeneratePDF;
