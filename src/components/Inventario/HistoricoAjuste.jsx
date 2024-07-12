import { useEffect, useState } from "react";
import { getAjuste } from "../../services/CajaService";
import { Table } from "flowbite-react";
import PaginationButtons from "../PaginationButtons";
import { DateFormatter } from "../Constants";

function HistoricoAjuste({ search, reload }) {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [ajustes, setAjustes] = useState([]);

  useEffect(() => {
    const Load = async () => {
      const page = Math.ceil(currentPage + 1, totalPages);
      await getAjuste(page, search).then((response) => {
        setAjustes(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      });
    };
    Load();
  }, [currentPage, search, reload]);

  return (
    <div className="flex flex-col w-full">
      <Table>
        <Table.Head>
          <Table.HeadCell>Codigo</Table.HeadCell>
          <Table.HeadCell>Producto</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Motivo</Table.HeadCell>
          <Table.HeadCell>Cantidad</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {ajustes.map((ajuste) => (
            <Table.Row
              key={ajuste.id_ajusteDetalle}
              className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
            >
              <Table.Cell className="text-gray-900 dark:text-white">
                {ajuste.id_producto}
              </Table.Cell>
              <Table.Cell className="text-gray-900 dark:text-white">
                {ajuste.producto}
              </Table.Cell>
              <Table.Cell className="text-gray-900 dark:text-white">
                {DateFormatter(new Date(ajuste.fecha))}
              </Table.Cell>
              <Table.Cell className="text-gray-900 dark:text-white">
                {ajuste.razon}
              </Table.Cell>

              <Table.Cell className="text-gray-900 dark:text-white">
                {Math.abs(ajuste.cantidad)}
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
  );
}

export default HistoricoAjuste;
