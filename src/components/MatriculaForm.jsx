import React, { useState, useEffect } from "react";
import { updateMatricula, getGrados } from "../services/AcademicoService";
import { Button, Checkbox } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { BiError } from 'react-icons/bi';

const MatriculaForm = ({ matricula, onClose }) => {
  const [formData, setFormData] = useState({
    id_grado: matricula.id_grado.id_grado,
    trabaja: matricula.trabaja,
    es_interno: matricula.es_interno,
  });

  const [grados, setGrados] = useState([]);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const response = await getGrados();
        setGrados(response.data);
      } catch (error) {
        console.error("Error al obtener los grados:", error);
      }
    };
    fetchGrados();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = name === "trabaja" || name === "es_interno" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMatricula(matricula.id_matricula, formData);
      onClose(); // Cerrar el formulario después de la actualización exitosa
      toast.success("Matrícula actualizada exitosamente!", { duration: 5000 });
    } catch (error) {
      console.error("Error al actualizar la matrícula:", error);
      toast.error("Error al actualizar la matrícula", {
        duration: 5000,
        icon: <BiError color="red" fontSize="5.5rem" />,
      });
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-6">Editar Matrícula</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id_grado" className="block text-base font-medium text-gray-700">
            Grado
          </label>
          <select
            value={formData.id_grado}
            name="id_grado"
            onChange={handleChange}
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            {grados.map((grado) => (
              <option key={grado.id_grado} value={grado.id_grado}>
                {grado.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={formData.trabaja}
            name="trabaja"
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="trabaja" className="text-base font-medium text-gray-700">
            Trabaja
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={formData.es_interno}
            name="es_interno"
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="es_interno" className="text-base font-medium text-gray-700">
            Es Interno
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Guardar
          </Button>
          <Button
            type="button"
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MatriculaForm;
