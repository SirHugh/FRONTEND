import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/fundationLogo.png"; // Ajusta la ruta según tu estructura de carpetas

const GeneratePDF = (comprobante, detalleList, organization, qrCode, cliente) => {
  const doc = new jsPDF({ orientation: "landscape" });

  // Encabezado
  doc.addImage(logo, 'JPEG', 14, 15, 30, 30);
  doc.setFontSize(10);
  doc.text("Fundación Unidos por Cristo", 50, 15);
  doc.setFontSize(8);
  doc.text(organization.direccion, 50, 20);
  doc.text(`Tel.: ${organization.telefono}`, 50, 25);
  doc.text(`RUC: ${organization.ruc}`, 250, 15);
  doc.text(`Nº de Timbrado: ${comprobante.id_timbrado}`, 250, 20);
  doc.text(`FACTURA ELECTRONICA Nº ${comprobante.nro_factura}`, 250, 25);
  doc.text(`Fecha: ${comprobante.fecha}`, 250, 30);

  // Datos del Cliente
  doc.text(`Nombre o Razon Social: ${cliente?.nombre} ${cliente?.apellido || ""}`, 14, 50);
  doc.text(`Dirección: ${cliente?.direccion || ""}`, 14, 55);
  doc.text(`Teléfono: ${cliente?.telefono || ""}`, 14, 60);
  doc.text(`Correo Electrónico: ${cliente?.email || ""}`, 14, 65);

  // Función para calcular IVA
  const calcularIVA = (monto, tipo) => {
    if (tipo === 'ventas') {
      return (parseFloat(monto) / 11).toFixed(2);
    }
    return 0;
  };

  const aranceles = detalleList.aranceles?.map(arancel => ({
    cantidad: 1,
    descripcion: arancel.nombre,
    precio_unitario: arancel.monto,
    exentas: arancel.monto,
    iva5: 0,
    iva10: 0,
  })) || [];

  const ventas = detalleList.ventas?.flatMap(venta => 
    venta.descripcion.map(item => ({
      cantidad: item.cantidad,
      descripcion: item.producto,
      precio_unitario: item.precio,
      exentas: 0,
      iva5: 0,
      iva10: item.precio,
    }))
  ) || [];

  const actividades = detalleList.actividades?.map(actividad => ({
    cantidad: 1,
    descripcion: actividad.actividad,
    precio_unitario: actividad.monto,
    exentas: actividad.monto,
    iva5: 0,
    iva10: 0,
  })) || [];

  const detalles = [...aranceles, ...ventas, ...actividades];

  autoTable(doc, {
    startY: 80,
    head: [['Cantidad', 'Descripción', 'Precio Unitario', { content: 'Valor de Venta', colSpan: 3, styles: { halign: 'center' } }], [' ', ' ', ' ', 'Exentas', 'IVA 5%', 'IVA 10%']],
    body: detalles.map(detalle => [
      detalle.cantidad,
      detalle.descripcion,
      detalle.precio_unitario,
      detalle.exentas,
      detalle.iva5,
      detalle.iva10,
    ]),
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 120 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
    },
  });

  // Calcular Totales
  const totalExentas = detalles.reduce((sum, item) => sum + parseFloat(item.exentas), 0);
  const totalIVA5 = detalles.reduce((sum, item) => sum + parseFloat(item.iva5), 0);
  const totalIVA10 = detalles.reduce((sum, item) => sum + parseFloat(item.iva10), 0);
  const totalIVA5Amount = totalIVA5 / 21;
  const totalIVA10Amount = totalIVA10 / 11;
  const totalGeneral = totalExentas + totalIVA5 + totalIVA10;

  // Subtotales y Totales
  const finalY = doc.autoTable.previous.finalY;
  doc.text(`Valor Parcial: ${totalGeneral.toFixed(2)}`, 14, finalY + 10);
  doc.text(`Total a Pagar: ${totalGeneral.toFixed(2)}`, 14, finalY + 20);
  doc.text(`Liquidación del IVA:`, 14, finalY + 30);
  doc.text(`(5%): ${totalIVA5Amount.toFixed(2)}`, 14, finalY + 40);
  doc.text(`(10%): ${totalIVA10Amount.toFixed(2)}`, 14, finalY + 50);

  // Código QR
  if (qrCode) {
    doc.addImage(qrCode, 'PNG', 250, finalY + 10, 50, 50);
  }

  // Representación gráfica del documento electrónico
  doc.setFontSize(8);
  doc.text('Este documento es una representación gráfica de un documento electrónico (XML)', 14, finalY + 70);

  // Guardar el PDF
  doc.save(`factura_${comprobante.nro_factura}.pdf`);
};

export default GeneratePDF;
