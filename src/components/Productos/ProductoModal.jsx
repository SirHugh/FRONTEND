import { useState, useEffect } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { createProducto, updateProducto } from "../../services/CajaService";
import toast from "react-hot-toast";
const ProductoModal = ({ show, producto, onClose }) => {
  const defaultData = {
    nombre: "",
    descripcion: "",
    codigo: "",
    tipo: "PR",
    stock: 0,
    stock_minimo: 0,
    precio: 0,
    es_activo: true,
    es_mensual: null,
    grados: [],
  };
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (producto) {
      const codigoOriginal = producto.codigo?.lastIndexOf("-");
      const codigo = producto.codigo?.substring(0, codigoOriginal);
      setFormData({ ...producto, codigo: codigo });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        tipo: "PR",
      }));
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const close = () => {
    setFormData(defaultData);
    onClose();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedProducto = {
      ...formData,
      precio: Number(formData.precio), // Convert price to number
      stock: Number(formData.stock), // Convert stock to number
      es_mensual: null,
    };
    try {
      if (updatedProducto.id_producto) {
        await updateProducto(updatedProducto.id_producto, updatedProducto);
        toast.success("Producto actualizado!", { duration: 5000 });
        close();
        return;
      } else {
        await createProducto(updatedProducto);
        toast.success("Producto registrado!", { duration: 5000 });
        close();
        return;
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al guardar los datos.");
      console.log(error);
      return;
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl" dismissible>
      <Modal.Header>
        {producto ? "Editar Producto" : "Agregar Producto"}
      </Modal.Header>
      <Modal.Body>
        <form action="" onSubmit={handleSave}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="nombre" value="Nombre" />
              <c className="text-red-700">*</c>
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
              <c className="text-red-700">*</c>
              <TextInput
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-row gap-2">
              <div>
                <Label htmlFor="codigo" value="Codigo" />
                <c className="text-red-700">*</c>
                <TextInput
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock" value="Stock Minimo" />
                <c className="text-red-700">*</c>
                <TextInput
                  id="stock_minimo"
                  name="stock_minimo"
                  value={formData.stock_minimo}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="precio" value="Precio" />
                <c className="text-red-700">*</c>
                <TextInput
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  type="number"
                  required
                />
              </div>
            </div>
          </div>
          <small className="text-red-700">* campos obligatorios</small>
          <div className="flex mt-5 justify-end w-full">
            <Button type="submit">{producto ? "Actualizar" : "Guardar"}</Button>
            {producto ? (
              <Button color="gray" onClick={onClose}>
                Cancelar
              </Button>
            ) : (
              ""
            )}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductoModal;
