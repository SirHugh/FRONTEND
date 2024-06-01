import React, { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { BiError } from 'react-icons/bi';
import { createGrado, updateGrado } from '../services/AcademicoService';

function GradoForm({ onClose, initialData, isEdit }) {
  const [gradoData, setGradoData] = useState({
    nombre: '',
    grado: '',
    nivel: '',
    turno: '',
    seccion: '',
    es_activo: false,
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setGradoData(initialData);
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGradoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setGradoData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateGrado(gradoData.id_grado, gradoData);
        toast.success("Grado actualizado exitosamente!", { duration: 5000 });
      } else {
        await createGrado(gradoData);
        toast.success("Grado creado exitosamente!", { duration: 5000 });
      }
      onClose();
    } catch (error) {
      toast.error(error.message, {
        duration: 5000,
        icon: <BiError color="red" fontSize="5.5rem" />,
      });
    }
  };

  return (
    <div className="absolute z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        <div className="bg-white w-full max-w-lg mx-auto p-8 rounded-md shadow-xl z-50">
          <h2 className="text-2xl font-bold mb-6">{isEdit ? "Editar Grado" : "Crear Nuevo Grado"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-base font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                value={gradoData.nombre}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="grado" className="block text-base font-medium text-gray-700">
                Grado
              </label>
              <input
                type="number"
                id="grado"
                name="grado"
                placeholder="Grado"
                value={gradoData.grado}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="nivel" className="block text-base font-medium text-gray-700">
                Nivel
              </label>
              <input
                type="text"
                id="nivel"
                name="nivel"
                placeholder="Nivel"
                value={gradoData.nivel}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="turno" className="block text-base font-medium text-gray-700">
                Turno
              </label>
              <input
                type="text"
                id="turno"
                name="turno"
                placeholder="Turno"
                value={gradoData.turno}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                required
              />
            </div>
            <div>
              <label htmlFor="seccion" className="block text-base font-medium text-gray-700">
                Sección
              </label>
              <input
                type="text"
                id="seccion"
                name="seccion"
                placeholder="Sección"
                value={gradoData.seccion}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="es_activo" className="block text-base font-medium text-gray-700">
                Activo
              </label>
              <input
                type="checkbox"
                id="es_activo"
                name="es_activo"
                checked={gradoData.es_activo}
                onChange={handleToggleChange}
                className="ml-3"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isEdit ? "Actualizar Grado" : "Crear Grado"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GradoForm;
