import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";

const ArancelModal_ = ({ arancel, onSave, onClose }) => {
  const [formData, setFormData] = useState(arancel || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header>Arancel</Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_matricula">
              Matricula
            </label>
            <input
              name="id_matricula"
              value={formData.id_matricula || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="id_matricula"
              type="text"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id_producto">
              Producto
            </label>
            <input
              name="id_producto"
              value={formData.id_producto || ""}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="id_producto"
              type="text"
            />
          </div>
          {/* Otros campos */}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Guardar</Button>
        <Button onClick={onClose} color="gray">Cancelar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArancelModal_;
