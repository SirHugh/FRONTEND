import React, { useState, useRef, useEffect } from 'react';
import { createAlumno } from '../services/AcademicoService';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const AlumnoForm = ({ onClose }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal de éxito
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para el modal de éxito
  const [alumnoData, setAlumnoData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    genero: '',
    fecha_nac: '',
    nacionalidad: '',
    barrio: '',
    edad_primer_grado: '',
    curso_jardin: '',
    cantidad_hermanos: '',
    telefono: ''
  });

  const formRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumnoData({
      ...alumnoData,
      [name]: value
    });
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(alumnoData).forEach((key) => {
      if (!alumnoData[key]) {
        newErrors[key] = 'Este campo es obligatorio';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // No se envía el formulario si hay errores
    }

    try {
      await createAlumno(alumnoData);
      setShowSuccessModal(true);
    }catch (error) {
      console.log("Datos del alumno: " + JSON.stringify(alumnoData));
      console.error('Error creating alumno:', error);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(); // Cerrar el formulario al cerrar el modal de éxito
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    //NO Cerrar el formulario al cerrar el modal de éxito
  };

  return (
    <div  className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="modal-container bg-white w-full max-w-[600px]  mx-auto p-8 rounded-md shadow-xl z-50">
          <h2 className="text-2xl font-bold mb-6">Crear Nuevo Alumno</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div>
              {/* Primeras 7 entradas */}
              {/* Ejemplo: */}
              <div className="mb-5">
                <label htmlFor="cedula" className="mb-3 block text-base font-medium text-[#07074D]">
                  Cédula
                </label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  placeholder="Cédula"
                  value={alumnoData.cedula}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.cedula ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                  required
                />
              </div>
              
              <div className="mb-5">
                <label htmlFor="apellido" className="mb-3 block text-base font-medium text-[#07074D]">
                    Apellido
                </label>
                <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Apellido"
                    value={alumnoData.apellido}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${errors.apellido ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                    required
                />
                </div>
                <div className="mb-5">
                <label htmlFor="telefono" className="mb-3 block text-base font-medium text-[#07074D]">
                    Teléfono
                </label>
                <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    placeholder="Teléfono"
                    value={alumnoData.telefono}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${errors.telefono ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                    required
                />
                </div>

            
            <div className="mb-5">
            <label htmlFor="curso_jardin" className="mb-3 block text-base font-medium text-[#07074D]">
                Curso jardín
            </label>
            <input
                type="text"
                id="curso_jardin"
                name="curso_jardin"
                placeholder="Curso jardín"
                value={alumnoData.curso_jardin}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.curso_jardin ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
            />
            </div>
            <div className="mb-5">
            <label htmlFor="cantidad_hermanos" className="mb-3 block text-base font-medium text-[#07074D]">
                Cantidad de hermanos
            </label>
            <input
                type="text"
                id="cantidad_hermanos"
                name="cantidad_hermanos"
                placeholder="Cantidad de hermanos"
                value={alumnoData.cantidad_hermanos}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.cantidad_hermanos ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
            />
            </div>
            <div className="mb-5">
            <label htmlFor="genero" className="mb-3 block text-base font-medium text-[#07074D]">
                Género
            </label>
            <select
                id="genero"
                name="genero"
                value={alumnoData.genero}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.genero ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
            >
                <option value="">Seleccionar género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
            </select>
            </div>
              {/* Resto de los campos para la primera columna */}
            </div>
            <div>
              {/* Campos restantes para la segunda columna */}
              {/* Ejemplo: */}
              <div className="mb-5">
                <label htmlFor="nombre" className="mb-3 block text-base font-medium text-[#07074D]">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  value={alumnoData.nombre}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${errors.nombre ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="fecha_nac" className="mb-3 block text-base font-medium text-[#07074D]">
                    Fecha de Nacimiento
                </label>
                <input
                    type="date"
                    id="fecha_nac"
                    name="fecha_nac"
                    placeholder="Fecha de Nacimiento"
                    value={alumnoData.fecha_nac}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${errors.fecha_nac ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                    required
                />
                </div>
                <div className="mb-5">
                <label htmlFor="nacionalidad" className="mb-3 block text-base font-medium text-[#07074D]">
                    Nacionalidad
                </label>
                <input
                    type="text"
                    id="nacionalidad"
                    name="nacionalidad"
                    placeholder="Nacionalidad"
                    value={alumnoData.nacionalidad}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${errors.nacionalidad ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
                />
            </div>
            <div className="mb-5">
            <label htmlFor="barrio" className="mb-3 block text-base font-medium text-[#07074D]">
                Barrio
            </label>
            <input
                type="text"
                id="barrio"
                name="barrio"
                placeholder="Barrio"
                value={alumnoData.barrio}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.barrio ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
            />
            </div>
            <div className="mb-5">
            <label htmlFor="edad_primer_grado" className="mb-3 block text-base font-medium text-[#07074D]">
                Edad primer grado
            </label>
            <input
                type="text"
                id="edad_primer_grado"
                name="edad_primer_grado"
                placeholder="Edad primer grado"
                value={alumnoData.edad_primer_grado}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.edad_primer_grado ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md`}
            />
            </div>
              {/* Resto de los campos para la segunda columna */}
            </div>
            <div className="flex justify-end">
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
                Crear Alumno
              </button>
            </div>
          </form>
          <SuccessModal
        show={showSuccessModal}
        onClose={closeSuccessModal}
        title={"Registro exitoso"}
        message={"El alumno ha sido registrado correctamente."}
      />

          <ErrorModal
        show={showErrorModal}
        onClose={closeErrorModal}
        title={"Error al intentar registrar alumno"}
        message={"Verifique que haya llenado los campos del formulario correctamente o que no exista un registro con el mismo número de cédula."}
      />
        </div>
      </div>
    </div>
  );
};

export default AlumnoForm;
