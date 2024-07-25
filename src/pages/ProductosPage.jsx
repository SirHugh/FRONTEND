import { useState, useEffect } from "react";
import { Table, Button, Tooltip } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import PaginationButtons from "../components/PaginationButtons";
import ProductoModal from "../components/Productos/ProductoModal";
import { getProducto } from "../services/CajaService";
import { FaPlus, FaToggleOff, FaToggleOn } from "react-icons/fa";
import toast from "react-hot-toast";
import { CurrencyFormatter } from "../components/Constants";
import { MdOutlineInventory2 } from "react-icons/md";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getProducto("", "PR", page);
        setProductos(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
      } catch (error) {
        toast.error("Error al obtener los productos:", error);
      }
    };
    loadProductos();
  }, [currentPage, reload]);

  const handleShowActivate = async () => {};

  const onClose = () => {
    setShowModal(false);
    setReload(!reload);
    setSelectedProducto(null);
  };

  return (
    <div>
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <MdOutlineInventory2 className="text-blue-500" />
        <h1 className="">Productos</h1>
      </div>
      <div className="flex flex-row justify-end h-16 p-3 gap-3 items-center">
        <Button
          className="flex flex-wrap bg-blue-500"
          onClick={() => {
            setSelectedProducto(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="mr-2 h-5 w-5" />
          <h1>Agregar Producto</h1>
        </Button>
      </div>
      <div className="overflow-x-auto w-full max-w-12xl bg-white ">
        <Table hoverable className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Codigo</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Stock Minimo</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {productos.map((producto) => (
              <Table.Row
                key={producto.id_producto}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{producto.id_producto}</Table.Cell>
                <Table.Cell>{producto.codigo}</Table.Cell>
                <Table.Cell>{producto.nombre}</Table.Cell>
                <Table.Cell>{producto.descripcion}</Table.Cell>
                <Table.Cell>{producto.stock_minimo}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(producto.precio)}</Table.Cell>
                <Table.Cell
                  className={`${
                    producto.es_activo ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {producto.es_activo ? "Activo" : "Inactivo"}
                </Table.Cell>
                <Table.Cell>
                  <Tooltip content="Editar" placement="right">
                    <BiEdit
                      className="text-2xl cursor-pointer"
                      title="Editar"
                      onClick={() => {
                        setSelectedProducto(producto);
                        setShowModal(true);
                      }}
                    />
                  </Tooltip>
                </Table.Cell>
                <Table.Cell>
                  <Tooltip
                    content={producto.es_activo ? "Desactivar" : "Activar"}
                  >
                    <button
                      className="text-blue-500"
                      onClick={() => handleShowActivate(producto)}
                    >
                      {producto.es_activo ? (
                        <FaToggleOn className="size-6 text-blue-500" />
                      ) : (
                        <FaToggleOff className="size-6 text-red-800" />
                      )}
                    </button>
                  </Tooltip>
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
      <ProductoModal
        show={showModal}
        producto={selectedProducto}
        onClose={onClose}
      />
    </div>
  );
};

export default ProductosPage;
