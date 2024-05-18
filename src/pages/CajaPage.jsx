import React, { useState, useEffect } from "react";
import { getProducto, createProducto, updateProducto, getArancel, createArancel, updateArancel } from "../services/CajaService";

function CajaPage() {
  const [productos, setProductos] = useState([]);
  const [aranceles, setAranceles] = useState([]);
  const [newProducto, setNewProducto] = useState({ grado: "", tipo: "" });
  const [newArancel, setNewArancel] = useState({ value: "", active: true });

  useEffect(() => {
    fetchProductos();
    fetchAranceles();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await getProducto(newProducto.grado, newProducto.tipo);
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchAranceles = async () => {
    try {
      const response = await getArancel(newArancel.value, newArancel.active, 1);
      setAranceles(response.data);
    } catch (error) {
      console.error("Error fetching aranceles:", error);
    }
  };

  const handleCreateProducto = async () => {
    try {
      await createProducto(newProducto);
      fetchProductos();
      setNewProducto({ grado: "", tipo: "" });
    } catch (error) {
      console.error("Error creating producto:", error);
    }
  };

  const handleCreateArancel = async () => {
    try {
      await createArancel(newArancel);
      fetchAranceles();
      setNewArancel({ value: "", active: true });
    } catch (error) {
      console.error("Error creating arancel:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Caja Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Productos</h2>
        <input
          type="text"
          placeholder="Grado"
          value={newProducto.grado}
          onChange={(e) => setNewProducto({ ...newProducto, grado: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Tipo"
          value={newProducto.tipo}
          onChange={(e) => setNewProducto({ ...newProducto, tipo: e.target.value })}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateProducto}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Crear Producto
        </button>
        
        <ul className="mt-4">
          {productos.map((producto) => (
            <li key={producto.id} className="border-b p-2">
              {producto.grado} - {producto.tipo}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Aranceles</h2>
        <input
          type="text"
          placeholder="Value"
          value={newArancel.value}
          onChange={(e) => setNewArancel({ ...newArancel, value: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newArancel.active}
          onChange={(e) => setNewArancel({ ...newArancel, active: e.target.value === 'true' })}
          className="border p-2 mr-2"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button
          onClick={handleCreateArancel}
          className="bg-green-500 text-white p-2 rounded"
        >
          Crear Arancel
        </button>
        
        <ul className="mt-4">
          {aranceles.map((arancel) => (
            <li key={arancel.id} className="border-b p-2">
              {arancel.value} - {arancel.es_activo ? "Activo" : "Inactivo"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CajaPage;
