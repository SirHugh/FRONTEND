import React, { useState, useEffect } from 'react';
import { getGrados, getMatriculaAnioGrado } from '../services/AcademicoService';
import { HiOutlinePlus } from 'react-icons/hi';
import AddGradoForm from '../components/AddGradoForm'; // Importa el componente modal de creación de grado

function GradosPage() {
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    const loadGrados = async () => {
      setLoading(true);
      const res = await getGrados();
      setLoading(false);
      if (res.status === 200) {
        setGrados(res.data);
      } else {
        console.error('Error al cargar los grados:', res.message);
      }
    };
    loadGrados();
  }, []);

  const listAlumnos = async (id) => {
    setLoading(true);
    const res = await getMatriculaAnioGrado(anio, id);
    setLoading(false);
    if (res.status === 200) {
      setAlumnos(res.data);
    } else {
      alert(`No se encontraron estudiantes en este año y grado`);
      setAlumnos([]);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <HiOutlinePlus className="text-blue-500 text-2xl" />
          <h1 className="text-2xl">Grados</h1>
        </div>
        <button onClick={handleShowModal} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
          Agregar Grado
        </button>
      </div>
      {showModal && <AddGradoForm onClose={handleCloseModal} />} {/* Mostrar el modal si showModal es true */}
      <div className="flex items-center mb-4">
        <label htmlFor="anio" className="mr-2">
          Año Lectivo
        </label>
        <input
          type="number"
          name="anio"
          id="anio"
          className="w-24 h-10 px-3 bg-white border border-gray-300 rounded-md focus:outline-none"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Grado</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Nivel</th>
              <th className="px-4 py-2">Turno</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-4 text-center">
                  <h1>Cargando lista de grados</h1>
                </td>
              </tr>
            ) : (
              grados.map((grado) => (
                <tr
                  key={grado.id_grado}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => listAlumnos(grado.id_grado)}
                >
                  <td className="px-4 py-2">{grado.grado}°</td>
                  <td className="px-4 py-2">{grado.nombre}</td>
                  <td className="px-4 py-2">{grado.nivel}</td>
                  <td className="px-4 py-2">{grado.turno}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div>
        {alumnos.map((alumno) => (
          <p key={alumno.id_matricula}>
            {alumno.id_alumno.nombre} {alumno.id_alumno.apellido}
          </p>
        ))}
      </div>
    </div>
  );
}

export default GradosPage;
