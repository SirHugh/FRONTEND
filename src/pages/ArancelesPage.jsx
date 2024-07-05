import { useState, useEffect } from "react";
import { Table, Button, TextInput } from "flowbite-react";
import { BiEdit, BiError } from "react-icons/bi";
import { FaFileInvoice, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import PaginationButtons from "../components/PaginationButtons";
import ProductoModal from "../components/ProductoModal";
import {
  createProducto,
  getProducto,
  updateProducto,
} from "../services/CajaService";
import { CurrencyFormatter } from "../components/Constants";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdSearch } from "react-icons/md";

const ArancelesPage = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages) || 1;
        const res = await getProducto("", "AR", page, search);
        setProductos(res.data.results);
      } catch (error) {
        toast.error(error.message);
        console.error("Error al obtener los productos:", error);
      }
    };
    loadProductos();
  }, [currentPage, search]);

  const handleSave = async (producto) => {
    try {
      if (selectedProducto) {
        await updateProducto(selectedProducto.id_producto, producto);
        toast.success("Datos actualizados exitosamente!", { duration: 5000 });
      } else {
        await createProducto(producto);
        toast.success("Producto registrado exitosamente!", { duration: 5000 });
      }
      setShowModal(false);
      const res = await getProducto("", "AR");
      setProductos(res.data.slice(0, itemsPerPage));
    } catch (error) {
      toast.error("Ha ocurrido un error al guardar los datos.", {
        duration: 5000,
        icon: <BiError color="red" fontSize="5.5rem" />,
      });
      console.error(
        "Error al guardar el producto:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <LiaFileInvoiceDollarSolid className="text-blue-500" />
        <h1 className="">Aranceles</h1>
      </div>
      <div className="flex flex-row justify-between h-16 p-3 gap-3 items-center">
        <TextInput
          icon={MdSearch}
          name="search"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Arancel..."
        />
        <Button
          className="flex flex-wrap bg-blue-500"
          onClick={() => {
            setSelectedProducto(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="mr-2 h-5 w-5" />
          <h1>Agregar Arancel</h1>
        </Button>
      </div>
      <div className="overflow-x-auto w-full max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>Codigo</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>Tipo de pago</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {productos.map((producto) => (
              <Table.Row
                key={producto.id_producto}
                className={`bg-slate-100 dark:border-gray-700 dark:bg-gray-800 hover:border-l-blue-500 hover:border-l-4 `}
              >
                <Table.Cell>{producto.id_producto}</Table.Cell>
                <Table.Cell>{producto.nombre}</Table.Cell>
                <Table.Cell>{producto.descripcion}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(producto.precio)}</Table.Cell>
                <Table.Cell>
                  {producto.es_mensual != null ? "Único" : "Mensual"}
                </Table.Cell>
                <Table.Cell
                  className={`${
                    producto.es_activo ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {producto.es_activo ? "Activo" : "Inactivo"}
                </Table.Cell>
                <Table.Cell>
                  <BiEdit
                    className="text-2xl cursor-pointer"
                    title="Editar"
                    onClick={() => {
                      setSelectedProducto(producto);
                      setShowModal(true);
                    }}
                  />
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
      {showModal && (
        <ProductoModal
          producto={selectedProducto}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          tipo="AR" // Pasamos el tipo de producto
        />
      )}
    </div>
  );
};

export default ArancelesPage;
