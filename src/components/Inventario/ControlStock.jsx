import { Table } from "flowbite-react";
import PaginationButtons from "../PaginationButtons";
import { useEffect, useState } from "react";
import { getCompra, getVenta, getAjuste } from "../../services/CajaService";
import toast from "react-hot-toast";

function ControlStock({ search }) {
  const [transacciones, setTransacciones] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadTransacciones = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;

        // Fetching data from the services
        const [compraRes, ventaRes, ajusteRes] = await Promise.all([
          getCompra(null, page, search),
          getVenta(null, page, search),
          getAjuste(page, search),
        ]);

        // Merging and sorting data
        const transacciones = [
          ...compraRes.data.results.map(item => ({ ...item, tipo: "Compra" })),
          ...ventaRes.data.results.map(item => ({ ...item, tipo: "Venta" })),
          ...ajusteRes.data.results.map(item => ({ ...item, tipo: "Ajuste" })),
        ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setTransacciones(transacciones);
        setTotalPages(Math.ceil(Math.max(compraRes.data.count, ventaRes.data.count, ajusteRes.data.count) / 10));
      } catch (error) {
        toast.error(error.message);
        console.error("Error al obtener las transacciones:", error);
      }
    };
    loadTransacciones();
  }, [currentPage, search]);

  return (
    <div className="flex flex-row w-full">
      <div className="overflow-x-auto w-full max-w-12xl bg-white ">
        <Table hoverable className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Tipo de movimiento</Table.HeadCell>
            <Table.HeadCell>Producto</Table.HeadCell>
            <Table.HeadCell>Cantidad</Table.HeadCell>
            <Table.HeadCell>Comentario</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {transacciones?.map((transaccion, index) => (
              <Table.Row
                key={index}
                className={` bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{new Date(transaccion.fecha).toLocaleDateString()}</Table.Cell>
                <Table.Cell
                  className={`${transaccion.tipo == "Compra" ? "text-green-600" : "text-red-700"}`}
                >
                  {transaccion.tipo == "Compra" ? "Ingreso" : "Salida"}
                </Table.Cell>
                <Table.Cell>
                  {transaccion.detalle?.map((item, idx) => (
                    <div key={idx}>{item.producto}</div>
                  )) || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {transaccion.detalle?.map((item, idx) => (
                    <div key={idx}>{item.cantidad}</div>
                  )) || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  {transaccion.tipo === "Venta" && transaccion.alumno
                    ? `Alumno: ${transaccion.alumno}`
                    : transaccion.tipo === "Compra" && transaccion.nro_factura
                    ? `Factura: ${transaccion.nro_factura}`
                    : "N/A"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default ControlStock;
