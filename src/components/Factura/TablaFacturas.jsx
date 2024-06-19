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
        console.log(res);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    load();
    console.log(facturas);
  }, [currentPage, search]);

  const handleShowDetail = (id) => {
    showDetail !== id ? setShowDetail(id) : setShowDetail(null);
  };

  return (
    <div className="flex flex-col w-full px-5 bg-slate-200">
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
                className={`hover:bg-blue-200 bg-white border cursor-pointer justify-center ${
                  showDetail === factura.id_comprobante ? "" : ""
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
                } transition-all`}
              >
                <Table.Cell colSpan={6} className="bg-transparent pt-0 px-5 ">
                  <div className="flex flex-row p-2 gap-2 rounded-b-lg ">
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
                            <Table.Row className="bg-white border" key={index}>
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
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>N° Pago</Table.HeadCell>
                            <Table.HeadCell>Alumno</Table.HeadCell>
                            <Table.HeadCell>Concepto</Table.HeadCell>
                            <Table.HeadCell>Monto</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {factura.ventas?.map((pago, index) => (
                              <Table.Row
                                className="bg-white border"
                                key={index}
                              >
                                <Table.Cell>
                                  {pago.nro_pago + "/" + pago.nroPagos}
                                </Table.Cell>
                                <Table.Cell>{pago.alumno}</Table.Cell>
                                <Table.Cell>
                                  {pago.descripcion.map((d, index) => (
                                    <p key={index}>{d.producto}</p>
                                  ))}
                                </Table.Cell>
                                <Table.Cell>
                                  {CurrencyFormatter(Number(pago.monto))}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
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
