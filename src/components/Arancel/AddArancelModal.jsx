import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { getGrados } from "../../services/AcademicoService";
import { Months } from "../Constants";

const AddArancelModal = ({ producto, onSave, onClose, tipo }) => {
  const [grados, setGrados] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: tipo || "PR",
    stock: 0,
    stock_minimo: 0,
    precio: 0,
    es_activo: true,
    es_mensual: null,
    grados: [],
  });

  useEffect(() => {
    const fetchGrados = async () => {
      const res = await getGrados();
      if (res.status === 200) {
        setGrados(res.data);
      }
    };
    fetchGrados();

    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        tipo: producto.tipo,
        stock: producto.stock,
        stock_minimo: producto.stock_minimo,
        precio: producto.precio,
        es_activo: producto.es_activo,
        es_mensual: producto.es_mensual,
        grados: producto.grados || [],
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        tipo: tipo || "PR",
      }));
    }
  }, [producto, tipo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGradosChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevState) => ({
      ...prevState,
      grados: value,
    }));
  };

  const handleSave = async () => {
    const updatedProducto = {
      ...formData,
      precio: Number(formData.precio), // Convert price to number
      stock: Number(formData.stock), // Convert stock to number
      es_mensual: formData.tipo === "AR" ? formData.es_mensual : null,
    };

    try {
      console.log(
        "Datos del producto a guardar: " + JSON.stringify(updatedProducto)
      );
      await onSave(updatedProducto);
    } catch (error) {
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  return (
    <Modal show={true} onClose={onClose} size="md">
      <Modal.Header>
        {producto ? "Editar Arancel" : "Agregar Arancel"}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="nombre" value="Nombre" />
            <TextInput
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="descripcion" value="Descripción" />
            <TextInput
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="es_mensual" value="Mes de pago" />
            <Select
              id="es_mensual"
              name="es_mensual"
              value={formData.es_mensual !== null ? formData.es_mensual : ""}
              onChange={handleChange}
            >
              <option value="">Todos los meses</option>
              {Months.map((month) => (
                <option key={month.id} value={month.id}>
                  {month.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="precio" value="Precio" />
            <TextInput
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              type="number"
              required
            />
          </div>
          <div>
            <Label htmlFor="grados" value="Grados" />
            <Select
              id="grados"
              multiple={true}
              value={formData.grados}
              onChange={handleGradosChange}
            >
              {grados.map((grado) => (
                <option key={grado.id_grado} value={grado.id_grado}>
                  {grado.nombre}
                </option>
              ))}
            </Select>
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

export default AddArancelModal;
