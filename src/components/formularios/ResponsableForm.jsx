import React, { useState } from 'react';

const ResponsableForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    ruc: '',
    telefono: '',
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    ocupacion: '',
    parentesco: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar el error cuando se empieza a editar el campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    // Validación de campos obligatorios
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = 'Este campo es obligatorio';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Llamar a la función onSubmit del padre con los datos del formulario
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Formulario de Responsable</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Renderizar cada campo del formulario */}
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-5">
            <label htmlFor={key} className="mb-3 block text-base font-medium text-[#07074D]">
              {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
              value={value}
              onChange={handleChange}
              className={`w-full rounded-md border ${errors[key] ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
              required
            />
            {errors[key] && <span className="text-red-500">{errors[key]}</span>}
          </div>
        ))}
        <div className="flex justify-end col-span-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResponsableForm;
