// ArancelForm.jsx
import React, { useState } from "react";
import { TextInput, Select, Checkbox } from "flowbite-react";

const ArancelForm = ({ arancel, onSave }) => {
  const [formData, setFormData] = useState({
    id_matricula: "",
    id_producto: "",
    id_comprobante: "",
    fecha_vencimiento: "",
    nro_cuota: "",
    monto: "",
    es_activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="ID Matrícula"
        value={formData.id_matricula}
        name="id_matricula"
        onChange={handleChange}
        required
      />
      {/* Agregar más campos según el modelo Arancel */}
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ArancelForm;
