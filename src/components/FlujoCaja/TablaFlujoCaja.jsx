import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import PaginationButtons from "../PaginationButtons";
import { getFlujoCaja } from "../../services/CajaService";
import toast from "react-hot-toast";
import { CurrencyFormatter } from "../Constants";

function TablaFlujoCaja(search) {
  const [flujoCaja, setFlujoCaja] = useState([]);
  const [flujoCajaList, setFlujoCajaList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadTimbrados = async () => {
      const page = Math.min(currentPage + 1, totalPages);
      try {
        const res = await getFlujoCaja("", page, "");

        setFlujoCajaList(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        toast.error("Error al cargar la pagina");
        console.log(error);
      }
    };
    loadTimbrados();
  }, [currentPage, search]);

  return (
    <>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Hora apertura</Table.HeadCell>
            <Table.HeadCell>Hora cierre</Table.HeadCell>
            <Table.HeadCell>Saldo inicial</Table.HeadCell>
            <Table.HeadCell>Ingresos</Table.HeadCell>
            <Table.HeadCell>Egresos</Table.HeadCell>
            <Table.HeadCell>Saldo final</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {flujoCajaList.map((flujo) => (
              <Table.Row
                key={flujo.id_flujoCaja}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{flujo.fecha}</Table.Cell>

                <Table.Cell>
                  {String(flujo.hora_apertura).substring(0, 8)}
                </Table.Cell>

                <Table.Cell>
                  {String(flujo.hora_cierre).substring(0, 8)}
                </Table.Cell>

                <Table.Cell>
                  {CurrencyFormatter(Number(flujo.monto_apertura))}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(flujo.entrada))}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(flujo.salida))}
                </Table.Cell>
                <Table.Cell>
                  {CurrencyFormatter(Number(flujo.monto_cierre))}
                </Table.Cell>
                <Table.Cell>
                  <button className="text-blue-500" onClick={() => {}}>
                    Ver
                  </button>
                  {flujo.es_activo ? "" : ""}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
        />
      </div>
    </>
  );
}

export default TablaFlujoCaja;
