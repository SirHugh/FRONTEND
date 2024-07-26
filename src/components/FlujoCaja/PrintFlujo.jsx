import toast from "react-hot-toast";
import { getFlujoCaja } from "../../services/CajaService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CurrencyFormatter } from "../Constants";

export const PrintFlujoPDF = async (id) => {
  let flujo;
  try {
    const res = await getFlujoCaja(id);
    console.log(res.data);
    flujo = res.data;
  } catch (error) {
    toast.error(error.response.data.error);
  }
  const doc = new jsPDF();

  doc.text("Reporte de Flujo de Caja", doc.internal.pageSize.width / 2, 10, {
    align: "center",
  });

  //Informacion Control Stock
  doc.setFont("helvetica", "normal"); // set a fixed-width font
  doc.setFontSize(11); // set font size

  doc.text("Id:", 15, 20);
  doc.text(`${flujo.id_flujoCaja}`, 50, 20); // column 1

  doc.text("Fecha:", 15, 25);
  doc.text(`${flujo.fecha}`, 50, 25); // column 1

  doc.text("Usuario:", 15, 30);
  doc.text(`${flujo.usuario}`, 50, 30); // column 1

  doc.text("Hora Apertura:", 15, 35);
  doc.text(`${flujo.hora_apertura.substring(0, 8)}`, 50, 35); // column 1

  doc.text("Hora Cierre:", 15, 40);
  doc.text(`${flujo.hora_cierre?.substring(0, 8)}`, 50, 40); // column 1

  doc.text(`Monto Apertura:`, 15, 45);
  doc.text(`${CurrencyFormatter(Number(flujo.monto_apertura))}`, 50, 45);

  doc.text(`Monto Cierre:`, 15, 50);
  doc.text(`${CurrencyFormatter(Number(flujo.monto_cierre))}`, 50, 50);

  doc.text(`Total Ingresos:`, 15, 55);
  doc.text(`${CurrencyFormatter(Number(flujo.entrada))}`, 50, 55);

  doc.text(`Total Egreso: `, 15, 60);
  doc.text(`${CurrencyFormatter(Number(flujo.salida))}`, 50, 60);
  doc.text(`Balance:`, 15, 65);
  doc.text(
    `${CurrencyFormatter(Number(flujo.entrada) - Number(flujo.salida))}`,
    50,
    65
  );

  autoTable(doc, {
    startY: 70,
    head: [["Nro", "Hora", "Condición", "Forma Pago", "Monto", "Movimiento"]],
    body: flujo.facturas?.map((factura) => {
      return [
        factura.nro_factura,
        factura.hora,
        factura.tipo_pago === "C" ? "Contado" : factura.tipo_pago,
        factura.forma_pago,
        factura.monto,
        "Entrada",
      ];
    }),
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Nro", "Hora", "Monto", "Movimiento"]],
    body: flujo.compras?.map((compra) => {
      return [
        compra.nro_factura,
        compra.tiempo_alta.substring(11, 19),
        compra.monto,
        "Salida",
      ];
    }),
  });

  const pageCount = doc.internal.getNumberOfPages();

  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "Página " + String(i) + " de " + String(pageCount),
      doc.internal.pageSize.width / 2,
      287,
      {
        align: "center",
      }
    );
  }

  doc.save(`flujo_caja-${flujo.fecha}.pdf`);
};
