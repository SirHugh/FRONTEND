import { Table } from "flowbite-react";
import { useEffect } from "react";
import { useState } from "react";
import PaginationButtons from "../PaginationButtons";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter } from "../Constants";
import { getCompra } from "../../services/CajaService";

function TablaCompras({ search }) {
  const [compras, setCompras] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDetail, setShowDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getCompra("", page, search);
        setTotalPages(Math.ceil(res.data.count / 10));
        setCompras(res.data.results);
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
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Hora</Table.HeadCell>
          <Table.HeadCell>Financiamiento</Table.HeadCell>
          <Table.HeadCell>Monto</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {compras?.map((compra) => (
            <>
              <Table.Row
                onClick={() => handleShowDetail(compra.id_compra)}
                key={compra.id_compra}
                className={`hover:bg-slate-200 border cursor-pointer ${
                  showDetail === compra.id_compra ? "bg-slate-200" : ""
                }`}
              >
                <Table.Cell>{compra.id_compra}</Table.Cell>
                <Table.Cell>{DateFormatter(new Date(compra.fecha))}</Table.Cell>
                <Table.Cell>{compra.hora}</Table.Cell>
                <Table.Cell>
                  {compra.id_flujoCaja ? "Caja" : "Externo"}
                </Table.Cell>

                <Table.Cell>
                  {CurrencyFormatter(Number(compra.monto))}
                </Table.Cell>
              </Table.Row>
              <Table.Row
                className={`${
                  showDetail === compra.id_compra ? "" : "hidden"
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
                          {compra.detalle.map((detalle, index) => (
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

export default TablaCompras;
