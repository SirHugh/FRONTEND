import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Select, Checkbox, Label } from "flowbite-react";

// Suponiendo que tienes una función para obtener la lista de grados
import { getGrados } from "../services/AcademicoService";

const ProductoModal = ({ producto, onSave, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("PR");
  const [stock, setStock] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [esActivo, setEsActivo] = useState(true);
  const [esMensual, setEsMensual] = useState(false);
  const [grados, setGrados] = useState([]);
  const [selectedGrados, setSelectedGrados] = useState([]);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setTipo(producto.tipo);
      setStock(producto.stock);
      setPrecio(producto.precio);
      setEsActivo(producto.es_activo);
      setEsMensual(producto.es_mensual);
      setSelectedGrados(producto.grados || []);
    }

    // Cargar los grados al montar el componente
    const fetchGrados = async () => {
      const res = await getGrados();
      if (res.status === 200) {
        setGrados(res.data);
      }
    };
    fetchGrados();
  }, [producto]);

  const handleSave = async () => {
    const updatedProducto = {
      nombre,
      descripcion: descripcion || "",
      tipo,
      stock: stock || 0,
      precio: precio || 0,
      es_activo: esActivo,
      es_mensual: esMensual,
      grados: selectedGrados,
    };

    console.log("Datos del producto a guardar:", JSON.stringify(updatedProducto, null, 2));

    try {
      await onSave(updatedProducto);
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  const handleGradosChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedGrados(value);
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>
        {producto ? "Editar Producto" : "Agregar Producto"}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre" value="Nombre" />
            <TextInput
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="descripcion" value="Descripción" />
            <TextInput
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tipo" value="Tipo" />
            <Select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="PR">PRODUCTO</option>
              <option value="AR">ARANCEL</option>
              <option value="AC">ACTIVIDAD</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="stock" value="Stock" />
            <TextInput
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="precio" value="Precio" />
            <TextInput
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="grados" value="Grados" />
            <Select
              id="grados"
              multiple={true}
              value={selectedGrados}
              onChange={handleGradosChange}
            >
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nombre}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="esActivo"
              checked={esActivo}
              onChange={(e) => setEsActivo(e.target.checked)}
            />
            <Label htmlFor="esActivo" value="Activo" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="esMensual"
              checked={esMensual}
              onChange={(e) => setEsMensual(e.target.checked)}
            />
            <Label htmlFor="esMensual" value="Mensual" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>
          {producto ? "Actualizar" : "Guardar"}
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductoModal;
