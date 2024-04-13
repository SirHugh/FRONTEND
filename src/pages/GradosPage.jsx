import React, { useState, useEffect } from 'react';
import { getGrados, getMatriculaAnioGrado, setGradoActive } from '../services/AcademicoService';
import { HiOutlinePlus } from 'react-icons/hi';
import AddGradoForm from '../components/AddGradoForm'; // Importa el componente modal de creación de grado
import AlumnosListModal from '../components/AlumnosListModal';

function GradosPage() {
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedGrado, setSelectedGrado] = useState(null);

  useEffect(() => {
    const loadGrados = async () => {
      setLoading(true);
      const res = await getGrados();
      setLoading(false);
      if (res.status === 200) {
        setGrados(res.data);// Almacena el id del grado seleccionado
      } else {
        console.error('Error al cargar los grados:', res.message);
      }
    };
    loadGrados();
  }, []);

  const listAlumnos = async (id, grado) => {
    setSelectedGrado(grado); // Establecer el grado seleccionado
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
  
  

  const handleShowFormModal = () => {
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGrado(null); // Restablece el grado seleccionado al cerrar el modal
  };

  const handleToggleChange = async (id, value) => {
    try {
      // Llama al servicio para activar o desactivar el grado
      await setGradoActive(id, value);
      // Recarga la lista de grados para reflejar el cambio
      const res = await getGrados();
      if (res.status === 200) {
        setGrados(res.data);
      } else {
        console.error('Error al cargar los grados:', res.message);
      }
    } catch (error) {
      console.error('Error al activar/desactivar el grado:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <HiOutlinePlus className="text-blue-500 text-2xl" />
          <h1 className="text-2xl">Grados</h1>
        </div>
        <button onClick={handleShowFormModal} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
          Agregar Grado
        </button>
      </div>
      {showFormModal && <AddGradoForm onClose={handleCloseFormModal} />} {/* Mostrar el modal si showModal es true */}
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
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
              {grados.map((grado) => (
                <tr
                  key={grado.id_grado}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => listAlumnos(grado.id_grado, grado)}
                >
                  <td className="px-4 py-2">{grado.grado}°</td>
                  <td className="px-4 py-2">{grado.nombre}</td>
                  <td className="px-4 py-2">{grado.nivel}</td>
                  <td className="px-4 py-2">{grado.turno}</td>
                  <td className="px-4 py-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={grado.es_activo}
                        onChange={(e) => handleToggleChange(grado.id_grado, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ${grado.es_activo ? 'peer-checked:bg-blue-600' : 'dark:bg-gray-700 peer-checked:bg-gray-600'} dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{grado.es_activo ? 'Activo' : 'Inactivo'}</span>
                    </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
      {alumnos.length > 0 && selectedGrado && (
        <AlumnosListModal
          show={true} // Mostrar el modal
          onClose={handleCloseModal} // Función para cerrar el modal
          alumnos={alumnos} // Lista de alumnos
          grado={selectedGrado.nombre} // Grado seleccionado
          seccion={selectedGrado.seccion} // Sección (podrías obtenerlo del objeto de grado si lo tienes)
          turno = {selectedGrado.turno}
        />
      )}
      </div>
    </div>
  );
}

export default GradosPage;
