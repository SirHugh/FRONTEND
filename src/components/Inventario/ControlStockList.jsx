import { useEffect, useState } from "react";
import { getControlStock } from "../../services/ComercialService";
import { Table } from "flowbite-react";
import PaginationButtons from "../PaginationButtons";
import toast from "react-hot-toast";

function ControlStockList() {
  const [controles, setControles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadControles = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getControlStock("", page);
        console.log(res.data);
        setControles(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadControles();
  }, [currentPage]);

  return (
    <div className="flex flex-col w-full justify-center">
      <div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Nro. Control</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Usuario</Table.HeadCell>
            <Table.HeadCell>Cantidad Productos</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {controles?.map((control) => (
              <Table.Row key={control.id_controlStock}>
                <Table.Cell className="whitespace-nowrap font-medium">
                  {control.id_controlStock}
                </Table.Cell>
                <Table.Cell>{control.fecha}</Table.Cell>
                <Table.Cell>{control.usuario}</Table.Cell>
                <Table.Cell>{control.cantidad_productos}</Table.Cell>
                <Table.Cell>
                  {control.es_activo ? "En proceso" : "Cerrado"}
                </Table.Cell>
                <Table.Cell>
                  <a
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    href={`/control-stock/${control.id_controlStock}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Detalle
                  </a>
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

export default ControlStockList;
