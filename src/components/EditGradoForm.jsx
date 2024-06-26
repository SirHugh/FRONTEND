import React, { useState, useEffect } from 'react';
import { updateGrado } from '../services/AcademicoService';
import SuccessModal from './SuccessModal';

function EditGradoForm({ grado, onClose }) {
  const [gradoData, setGradoData] = useState({
    nombre: grado.nombre,
    grado: grado.grado,
    nivel: grado.nivel,
    turno: grado.turno,
    seccion: grado.seccion,
    es_activo: grado.es_activo,
  });

  useEffect(() => {
    if (grado) {
      setGradoData({
        nombre: grado.nombre,
        grado: grado.grado,
        nivel: grado.nivel,
        turno: grado.turno,
        seccion: grado.seccion,
        es_activo: grado.es_activo,
      });
    }
  }, [grado]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      await updateGrado(grado.id_grado, gradoData); // Aquí pasamos el ID del grado
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al actualizar el grado:', error);
      setShowSuccessModal(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <div className="absolute z-12 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="modal-container bg-white w-full max-w-[600px] mx-auto p-8 rounded-md shadow-xl z-50">
          <h2 className="text-2xl font-bold mb-6">Editar Grado</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <label htmlFor="nombre" className="mb-3 block text-base font-medium text-[#07074D]">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    value={gradoData.nombre}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    required
                  />
                </div>
                    <div className="mb-5">
                    <label htmlFor="nivel" className="mb-3 block text-base font-medium text-[#07074D]">
                        Nivel
                    </label>
                    <input
                        type="text"
                        id="nivel"
                        name="nivel"
                        placeholder="Nivel"
                        value={gradoData.nivel}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        required
                    />
                    </div>
                    <div className="mb-5">
                    <label htmlFor="seccion" className="mb-3 block text-base font-medium text-[#07074D]">
                        Sección
                    </label>
                    <input
                        type="text"
                        id="seccion"
                        name="seccion"
                        placeholder="Sección"
                        value={gradoData.seccion}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    </div>
                </div>
                <div>
                    <div className="mb-5">
                    <label htmlFor="grado" className="mb-3 block text-base font-medium text-[#07074D]">
                        Grado
                    </label>
                    <input
                        type="number"
                        id="grado"
                        name="grado"
                        placeholder="Grado"
                        value={gradoData.grado}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        required
                    />
                    </div>
                    <div className="mb-5">
                    <label htmlFor="turno" className="mb-3 block text-base font-medium text-[#07074D]">
                        Turno
                    </label>
                    <input
                        type="text"
                        id="turno"
                        name="turno"
                        placeholder="Turno"
                        value={gradoData.turno}
                        onChange={handleChange}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        required
                    />
                    </div>
                {/* Resto de los campos omitidos por brevedad */}
                <div className="mb-5">
                  <label htmlFor="es_activo" className="mb-3 block text-base font-medium text-[#07074D]">
                    Estado
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="es_activo"
                      name="es_activo"
                      checked={gradoData.es_activo}
                      onChange={handleToggleChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activo</span>
                  </label>
                </div>
              </div>
              {/* Botones de acción */}
              <div className="flex justify-end col-span-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
          {/* Modal de éxito */}
          <SuccessModal
            show={showSuccessModal}
            onClose={closeSuccessModal}
            title={"Actualización exitosa"}
            message={"El grado ha sido actualizado."}
          />
        </div>
      </div>
    </div>
  );
}

export default EditGradoForm;
