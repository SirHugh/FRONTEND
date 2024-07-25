import { Table } from "flowbite-react";
import PaginationButtons from "../PaginationButtons";
import { useEffect, useState } from "react";
import { getProducto } from "../../services/CajaService";
import toast from "react-hot-toast";

function TablaInventario({ search, esActivo }) {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getProducto("", "PR", page, search, esActivo);
        setProductos(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
        console.log(res.data.results);
      } catch (error) {
        toast.error(error.message);
        console.error("Error al obtener los productos:", error);
      }
    };
    loadProductos();
  }, [currentPage, search, esActivo]);

  return (
    <div className="flex flex-row w-full">
      <div className="overflow-x-auto w-full max-w-12xl bg-white ">
        <Table hoverable className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>Codigo</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Stock</Table.HeadCell>
            <Table.HeadCell>Nivel</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {productos?.map((producto) => (
              <Table.Row
                key={producto.id_producto}
                className={` bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{producto.id_producto}</Table.Cell>
                <Table.Cell>{producto.nombre}</Table.Cell>
                <Table.Cell>
                  {producto.stock == 1
                    ? producto.stock + " unidad"
                    : producto.stock + " unidades"}
                </Table.Cell>
                <Table.Cell
                  className={`${
                    producto.stock == 0
                      ? "text-red-700"
                      : producto.stock < producto.stock_minimo
                      ? "text-yellow-400"
                      : "text-green-600"
                  }`}
                >
                  {producto.stock == 0
                    ? "Agotado"
                    : producto.stock <= producto.stock_minimo
                    ? "Bajo"
                    : "Optimo"}
                </Table.Cell>
                <Table.Cell
                  className={`${
                    producto.es_activo ? "text-green-600" : "text-red-700"
                  }`}
                >
                  {producto.es_activo ? "Activo" : "Inactivo"}
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

export default TablaInventario;
