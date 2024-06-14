import { Card, Table } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import { getComprobante } from "../../services/CajaService";
import PaginationButtons from "../PaginationButtons";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter, Months } from "../Constants";

function TablaFacturas({ search }) {
  const [facturas, setFacturas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetail, setShowDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getComprobante("", page, search);
        setTotalPages(Math.ceil(res.data.count / 10));
        setFacturas(res.data.results);
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
          <Table.HeadCell>N° Factura</Table.HeadCell>
          <Table.HeadCell>Cliente</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Tipo Pago</Table.HeadCell>
          <Table.HeadCell>Monto</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {facturas?.map((factura) => (
            <>
              <Table.Row
                onClick={() => handleShowDetail(factura.id_comprobante)}
                key={factura.id_comprobante}
                className={`hover:bg-slate-200 border cursor-pointer ${
                  showDetail === factura.id_comprobante ? "bg-slate-200" : ""
                }`}
              >
                <Table.Cell>{factura.id_comprobante}</Table.Cell>
                <Table.Cell>{factura.nro_factura}</Table.Cell>
                <Table.Cell>{factura.cliente}</Table.Cell>
                <Table.Cell>
                  {DateFormatter(new Date(factura.fecha))}
                </Table.Cell>
                <Table.Cell>
                  {factura.tipo_pago == "C" ? "Contado" : "Credito"}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(factura.monto))}
                </Table.Cell>
              </Table.Row>
              <Table.Row
                className={`${
                  showDetail === factura.id_comprobante ? "" : "hidden"
                } transition-transform`}
              >
                <Table.Cell colSpan={4} className="bg-white pt-0 ">
                  <div className="flex flex-row p-2 gap-2 rounded-b-lg bg-slate-200">
                    <div
                      className={`flex flex-col gap-2 ${
                        factura.aranceles.length == 0 ? "hidden" : ""
                      }`}
                    >
                      <h1 className="font-bold">Aranceles</h1>
                      <Table>
                        <Table.Head>
                          <Table.HeadCell>N° Pago</Table.HeadCell>
                          <Table.HeadCell>Alumno</Table.HeadCell>
                          <Table.HeadCell>Concepto</Table.HeadCell>
                          <Table.HeadCell>Monto</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                          {factura.aranceles?.map((arancel, index) => (
                            <Table.Row key={index} className="border">
                              <Table.Cell>{arancel.nro_cuota}</Table.Cell>
                              <Table.Cell>{arancel.alumno}</Table.Cell>
                              <Table.Cell>{arancel.nombre}</Table.Cell>
                              <Table.Cell>
                                {CurrencyFormatter(Number(arancel.monto))}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </div>
                    <div
                      className={`flex flex-col gap-2 ${
                        factura.ventas.length == 0 ? "hidden" : ""
                      }`}
                    >
                      <h1 className="font-bold">Ventas</h1>
                      <div className="flex flex-row gap-2">
                        {factura.Ventas?.map((pago, index) => (
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

export default TablaFacturas;
