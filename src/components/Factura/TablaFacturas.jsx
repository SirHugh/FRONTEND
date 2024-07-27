import React, { useEffect, useState } from "react";
import { Card, Table } from "flowbite-react";
import { getComprobante } from "../../services/CajaService";
import PaginationButtons from "../PaginationButtons";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter } from "../Constants";
import { RiBillFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function TablaFacturas({ search }) {
  const [facturas, setFacturas] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetail, setShowDetail] = useState(null);

  useEffect(() => {
    const loadFacturas = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getComprobante("", page, search);
        setTotalPages(Math.ceil(res.data.count / 10));
        
        // Ordenar las facturas por id_comprobante en orden descendente
        const sortedFacturas = res.data.results.sort((a, b) => b.id_comprobante - a.id_comprobante);
        setFacturas(sortedFacturas);
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadFacturas();
  }, [currentPage, search, totalPages]);

  const handleShowDetail = (id) => {
    setShowDetail(showDetail !== id ? id : null);
  };

  return (
    <div className="flex flex-col w-full px-5 bg-slate-200">
      <Table>
        <Table.Head>
          <Table.HeadCell>Codigo</Table.HeadCell>
          <Table.HeadCell>N° Factura</Table.HeadCell>
          <Table.HeadCell>Cliente</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Hora</Table.HeadCell>
          <Table.HeadCell>Condicion Pago</Table.HeadCell>
          <Table.HeadCell>Forma de pago</Table.HeadCell>
          <Table.HeadCell>Monto</Table.HeadCell>
          <Table.HeadCell>Ver factura</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {facturas.map((factura) => (
            <React.Fragment key={factura.id_comprobante}>
              <Table.Row
                onClick={() => handleShowDetail(factura.id_comprobante)}
                className={`hover:bg-blue-200 bg-white border cursor-pointer justify-center ${
                  showDetail === factura.id_comprobante ? "" : ""
                }`}
              >
                <Table.Cell>{factura.id_comprobante}</Table.Cell>
                <Table.Cell>{factura.nro_factura}</Table.Cell>
                <Table.Cell>
                  {factura.cliente?.nombre} {factura.cliente?.apellido}
                </Table.Cell>
                <Table.Cell>
                  {DateFormatter(new Date(factura.fecha))}
                </Table.Cell>
                <Table.Cell>{String(factura.hora).substring(0, 5)}</Table.Cell>
                <Table.Cell>
                  {factura.tipo_pago === "C" ? "Contado" : "Credito"}
                </Table.Cell>
                <Table.Cell>
                  {factura.forma_pago || "No especificado"}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(factura.monto))}
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/printFactura/${factura.id_comprobante}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <RiBillFill />
                  </Link>
                </Table.Cell>
              </Table.Row>
              <Table.Row
                className={`${
                  showDetail === factura.id_comprobante ? "" : "hidden"
                } transition-all`}
              >
                <Table.Cell colSpan={8} className="bg-transparent pt-0 px-5">
                  <div className="flex flex-row p-2 gap-2 rounded-b-lg">
                    {/* Detalle Factura - Pago Aranceles */}
                    {factura.aranceles.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h1 className="font-bold">Aranceles</h1>
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>N° Pago</Table.HeadCell>
                            <Table.HeadCell>Alumno</Table.HeadCell>
                            <Table.HeadCell>Concepto</Table.HeadCell>
                            <Table.HeadCell>Monto</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {factura.aranceles.map((arancel, index) => (
                              <Table.Row
                                className="bg-white border"
                                key={index}
                              >
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
                    )}
                    {/* Detalle Factura - Pago Ventas */}
                    {factura.ventas.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h1 className="font-bold">Ventas</h1>
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>N° Pago</Table.HeadCell>
                            <Table.HeadCell>Alumno</Table.HeadCell>
                            <Table.HeadCell>Concepto</Table.HeadCell>
                            <Table.HeadCell>Monto</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {factura.ventas.map((pago, index) => (
                              <Table.Row
                                className="bg-white border"
                                key={index}
                              >
                                <Table.Cell>{`${pago.nro_pago}/${pago.nroPagos}`}</Table.Cell>
                                <Table.Cell>{pago.alumno}</Table.Cell>
                                <Table.Cell>
                                  {pago.descripcion.map((d, idx) => (
                                    <p key={idx}>{d.producto}</p>
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
                    )}
                    {/* Detalle Factura - Pago Actividades */}
                    {factura.actividades.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h1 className="font-bold">Actividades</h1>
                        <Table>
                          <Table.Head>
                            <Table.HeadCell>Codigo</Table.HeadCell>
                            <Table.HeadCell>Alumno</Table.HeadCell>
                            <Table.HeadCell>Concepto</Table.HeadCell>
                            <Table.HeadCell>Monto</Table.HeadCell>
                          </Table.Head>
                          <Table.Body>
                            {factura.actividades.map((item, index) => (
                              <Table.Row
                                className="bg-white border"
                                key={index}
                              >
                                <Table.Cell>{item.id_pagoActividad}</Table.Cell>
                                <Table.Cell>{item.alumno}</Table.Cell>
                                <Table.Cell>{item.actividad}</Table.Cell>
                                <Table.Cell>
                                  {CurrencyFormatter(Number(item.monto))}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </div>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            </React.Fragment>
          ))}
        </Table.Body>
      </Table>
      <PaginationButtons
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default TablaFacturas;
