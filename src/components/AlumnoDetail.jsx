import React, { useState, useEffect } from 'react';
import { getAlumnoById, deleteAlumno, updateAlumno } from '../services/AcademicoService';
import { useParams } from 'react-router-dom';
import AlumnoCard from './AlumnoCard';
import DeleteModal from './DeleteModal';
import SuccessModal from './SuccessModal'; // Importar el componente SuccessModal

const AlumnoDetail = () => {
  const [alumno, setAlumno] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para el modal de éxito
  const { id } = useParams();

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await getAlumnoById(id);
        setAlumno(response.data);
      } catch (error) {
        console.error('Error fetching alumno details:', error);
      }
    };
    fetchAlumno();
  }, [id]);

  const handleDelete = async (alumnoId) => {
    try {
      await deleteAlumno(alumnoId);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting alumno:', error);
    }
  };

  const handleSubmit = async (updatedAlumno) => {
    try {
      const alumnoFormData = new FormData();
      for (var key in updatedAlumno) {
        if (key === "fotocarnet" && updatedAlumno[key] instanceof File) {
          alumnoFormData.append(key, updatedAlumno[key]);
        } else {
          alumnoFormData.append(key, updatedAlumno[key] ? updatedAlumno[key] : "");
        }
      }
      await updateAlumno(updatedAlumno.id_alumno, alumnoFormData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating alumno:', error);
    }
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.href = '/alumnos';
  };

  return (
    <div>
      {alumno ? (
        <div className="flex justify-center items-center">
          <div className="bg-white p-4 rounded-md ">
            <AlumnoCard alumno={alumno} onDelete={toggleDeleteModal} onSubmit={handleSubmit} />
            <DeleteModal
              show={showDeleteModal}
              onDelete={() => handleDelete(alumno.id_alumno)}
              onCancel={toggleDeleteModal}
              message={"¿Estás seguro de que deseas eliminar este alumno? Esta acción no se puede deshacer."}
            />
            <SuccessModal
              show={showSuccessModal}
              onClose={closeSuccessModal}
              title={"Datos actualizados"}
              message={"Los datos del alumno han sido modificados exitosamente."}
            />
          </div>
        </div>
      ) : (
        <p>Cargando datos del alumno...</p>
      )}
    </div>
  );
};

export default AlumnoDetail;
