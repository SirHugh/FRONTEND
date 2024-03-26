import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import userIcon from '../assets/icons/UsuariosIcon.svg';
import studentIcon from '../assets/icons/AlumnoIcon.svg';
import boxIcon from '../assets/icons/CajaIcon.svg';
import { getAlumnos, deleteAlumno } from "../services/AcademicoService";
import  EditButton  from "./Buttons/EditButton";
import  DeleteButton  from "./Buttons/DeleteButton";
import SeeButton from "./Buttons/SeeButton";
import AlumnoForm from "./AlumnoForm"; // Importar el componente AlumnoForm
import DeleteModal from "./DeleteModal";
import SuccessModal from "./SuccessModal";

export const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlumnoForm, setShowAlumnoForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedAlumnoId, setDeletedAlumnoId] = useState(null);
  const itemsPerPage = 10;

  const handleToggleModal = () => {
    setShowAlumnoForm(!showAlumnoForm);
  };

  useEffect(() => {
    async function loadAlumnos() {
      const res = await getAlumnos();
      setAlumnos(res.data);
    }
    loadAlumnos();
  }, []);

  const handleDelete = async (alumnoId) => {
    try {
      // Almacenar el ID del alumno que se eliminará
      setDeletedAlumnoId(alumnoId);
      // Mostrar el modal de eliminación
      setShowDeleteModal(true);
    } catch (error) {
      console.error('Error deleting alumno:', error);
    }
  };
  
  // Función para confirmar la eliminación del alumno desde el modal
  const handleDeleteConfirm = async () => {
    try {
      await deleteAlumno(deletedAlumnoId);
      // Mostrar el modal de éxito después de eliminar el alumno
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting alumno:', error);
    }
  };
  
  // Función para cancelar la eliminación del alumno desde el modal
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Redirigir a la página de alumnos
    window.location.href = '/alumnos';
  };

  // Filtra los alumnos por nombre y apellido
  const filteredAlumnos = alumnos.filter(
    (alumno) =>
      alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcula el índice del primer y último elemento a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlumnos.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula cuántas filas en blanco agregar después de los elementos actuales
  const emptyRows = itemsPerPage - currentItems.length;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar la adición de un nuevo alumno
  const handleAddAlumno = () => {
    // Aquí puedes implementar la lógica para agregar un nuevo alumno
    console.log("Agregar nuevo alumno");
    setShowAlumnoForm(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-full max-w-8xl flex justify-left mb-2">
        <input
          type="text"
          placeholder="Buscar alumno"
          className="border border-gray-300 rounded-md px-4 py-2 w-64 mr-4"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto w-full max-w-8xl">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Encabezado de la tabla */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Apellido
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Cedula
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Nacimiento
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          {/* Cuerpo de la tabla */}
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Muestra los elementos actuales */}
            {currentItems.map((alumno) => (
              <tr key={alumno.id_alumno}>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.fecha_nac}</td>
                <td className="px-6 py-4 whitespace-nowrap">{alumno.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <EditButton onClick={() => handleEdit(alumno.id_alumno)} />
                  <Link to={`/alumnos/${alumno.id_alumno}`}>
                      <SeeButton />
                  </Link>
                  <DeleteButton onClick={() => handleDelete(alumno.id_alumno)} />
                </td>
              </tr>
            ))}
            {/* Agrega filas en blanco si es necesario */}
            {[...Array(emptyRows)].map((_, index) => (
              <tr key={index} className="h-10">
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Controles de paginación */}
      <div className="mt-4 flex justify-center">
        <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Anterior
          </button>
          {[...Array(Math.ceil(filteredAlumnos.length / itemsPerPage)).keys()].map((number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === number + 1 ? "text-indigo-500 bg-indigo-50" : "text-gray-700"
              } hover:bg-gray-50`}
            >
              {number + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredAlumnos.length / itemsPerPage)}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Siguiente
          </button>
        </nav>
      </div>
      {/* Botón para añadir un nuevo alumno */}
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddAlumno}
        >
          Añadir Alumno
        </button>
        {/* Renderizado condicional del modal */}
      {showAlumnoForm && <AlumnoForm onClose={handleToggleModal} />}
      <SuccessModal
          show={showSuccessModal}
          onClose={closeSuccessModal}
          title={"Borrado exitoso"}
          message={"El alumno ha sido eliminado correctamente."}
        />
        {/* Modal de confirmación de eliminación */}
        <DeleteModal
          show={showDeleteModal}
          onDelete={() => handleDeleteConfirm(deletedAlumnoId)} // Pasar deletedAlumnoId como argumento
          onCancel={handleDeleteCancel} // Usar handleDeleteCancel para cancelar la eliminación
          message={"¿Estás seguro de que deseas eliminar este alumno? Esta acción no se puede deshacer."}
        />

      </div>
    </div>
  );
};
