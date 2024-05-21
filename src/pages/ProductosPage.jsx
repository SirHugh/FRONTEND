import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { BiEdit } from "react-icons/bi";
import PaginationButtons from "../components/PaginationButtons";
import ProductoModal from "../components/ProductoModal";
import { getProducto, createProducto, updateProducto } from "../services/CajaService";
import { FaPlus } from "react-icons/fa";
import { Button } from "flowbite-react";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const res = await getProducto(currentPage + 1, searchTerm);
        if (res.status === 200) {
          setProductos(res.data.slice(0, itemsPerPage));
          setTotalPages(Math.ceil(res.data.length / itemsPerPage));
        } else {
          console.error("Error al cargar los productos:", res.message);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    loadProductos();
  }, [currentPage, searchTerm]);

  const handleSave = async (producto) => {
    try {
      if (selectedProducto) {
        await updateProducto(selectedProducto.id_producto, producto);
      } else {
        console.log("Datos del producto a guardar: "+JSON.stringify(producto));
        await createProducto(producto);
      }
      setShowModal(false);
      const res = await getProducto(currentPage + 1, searchTerm);
      setProductos(res.data.slice(0, itemsPerPage));
    } catch (error) {
      console.error("Error al guardar el producto:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <h1 className="">PRODUCTOS</h1>
      </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3  items-center">
          <div>
            <Button
                  className="flex flex-wrap bg-blue-500"
                  onClick={() => { setSelectedProducto(null); setShowModal(true); }}
                >
                  <FaPlus className="mr-2 h-5 w-5" />
                  <h1>Agregar Producto</h1>
                </Button>
          </div>
        </div>
      <div className="overflow-x-auto w-full px-10 max-w-12xl bg-white">
        <Table className="divide-y">
          <Table.Head className="bg-gray-500">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Tipo</Table.HeadCell>
            <Table.HeadCell>Stock</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>Activo</Table.HeadCell>
            <Table.HeadCell>Mensual</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white divide-y">
            {productos.map((producto) => (
              <Table.Row
                key={producto.id_producto}
                className="hover:border-l-blue-500 hover:border-l-4"
              >
                <Table.Cell>{producto.id_producto}</Table.Cell>
                <Table.Cell>{producto.nombre}</Table.Cell>
                <Table.Cell>{producto.descripcion}</Table.Cell>
                <Table.Cell>{producto.tipo}</Table.Cell>
                <Table.Cell>{producto.stock}</Table.Cell>
                <Table.Cell>{producto.precio}</Table.Cell>
                <Table.Cell>{producto.es_activo ? "Sí" : "No"}</Table.Cell>
                <Table.Cell>{producto.es_mensual ? "Sí" : "No"}</Table.Cell>
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
        />
      )}
    </div>
  );
};

export default ProductosPage;
