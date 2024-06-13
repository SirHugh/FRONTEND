import { Card, Table } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { getVenta } from "../../services/CajaService";
import PaginationButtons from "../PaginationButtons";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter, Months } from "../Constants";

function TablaVentas({ search }) {
  const [ventas, setVentas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetail, setShowDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages);
        const res = await getVenta("", page, search);
        setVentas(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    load();
  }, [currentPage, search]);

  const handleShowDetail = (id) => {
    showDetail !== id ? setShowDetail(id) : setShowDetail(null);
  };
  return (
    <div className="flex flex-col w-full px-5 ">
      <Table>
        <Table.Head>
          <Table.HeadCell>Codigo</Table.HeadCell>
          <Table.HeadCell>Alumno</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Monto</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {ventas.map((venta) => (
            <>
              <Table.Row
                onClick={() => handleShowDetail(venta.id_venta)}
                key={venta.id_venta}
                className={`hover:bg-slate-200 border cursor-pointer ${
                  showDetail === venta.id_venta ? "bg-slate-200" : ""
                }`}
              >
                <Table.Cell>{venta.id_venta}</Table.Cell>
                <Table.Cell>{venta.alumno}</Table.Cell>
                <Table.Cell>{DateFormatter(new Date(venta.fecha))}</Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(venta.monto))}
                </Table.Cell>
              </Table.Row>
              <Table.Row
                className={`${
                  showDetail === venta.id_venta ? "" : "hidden"
                } transition-transform`}
              >
                <Table.Cell colSpan={4} className="bg-white pt-0 ">
                  <div className="flex flex-row p-2 gap-2 rounded-b-lg bg-slate-200">
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bold">Detalle</h1>
                      <Table>
                        <Table.Head>
                          <Table.HeadCell>Producto</Table.HeadCell>
                          <Table.HeadCell>Cantidad</Table.HeadCell>
                          <Table.HeadCell>Precio</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                          {venta.detalle.map((detalle, index) => (
                            <Table.Row key={index} className="border">
                              <Table.Cell>{detalle.producto}</Table.Cell>
                              <Table.Cell>{detalle.cantidad}</Table.Cell>
                              <Table.Cell>
                                {CurrencyFormatter(Number(detalle.precio))}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </div>
                    <div className="flex flex-col gap-2 ">
                      <h1 className="font-bold">Pagos</h1>
                      <div className="flex flex-row gap-2">
                        {venta.pagos?.map((pago, index) => (
                          <Card
                            key={index}
                            className={`max-w-sm ${
                              pago.es_activo ? "bg-red-300" : "bg-green-300"
                            }`}
                          >
                            <p>
                              <b>Mes: </b>{" "}
                              {
                                Months[
                                  new Date(pago.fecha_vencimiento).getMonth()
                                ]?.name
                              }
                            </p>
                            <p>
                              <b>N° pago: </b>
                              {pago.nro_pago}
                            </p>
                            <p>
                              <b>Vencimiento: </b>
                              {pago.fecha_vencimiento}
                            </p>
                            <p>
                              <b>Monto: </b>
                              {CurrencyFormatter(Number(pago.monto))}{" "}
                            </p>
                            <p
                              className={`${
                                pago.es_activo
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}
                            >
                              <b>Estado: </b>
                              {pago.es_activo ? "Pendiente" : "Cancelado"}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            </>
          ))}
        </Table.Body>
      </Table>
      <PaginationButtons
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
      />
    </div>
  );
}

export default TablaVentas;
