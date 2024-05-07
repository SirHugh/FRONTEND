import React, { useState, useEffect } from "react";
import { updateMatricula } from "../services/AcademicoService";

const MatriculaForm = ({ matricula, onClose }) => {
  const [formData, setFormData] = useState({
    id_alumno: matricula.id_alumno.id,
    id_grado: matricula.id_grado.id,
    fecha_inscripcion: matricula.fecha_inscripcion,
    anio_lectivo: matricula.anio_lectivo,
    es_activo: matricula.es_activo,
    fecha_desmatriculacion: matricula.fecha_desmatriculacion,
    trabaja: matricula.trabaja,
    es_interno: matricula.es_interno,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
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
    } catch (error) {
      console.error("Error al actualizar la matrícula:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-4">
        <label>
          Nombre del alumno:
          <input
            type="text"
            value={formData.id_alumno}
            name="id_alumno"
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Grado:
          <input
            type="text"
            value={formData.id_grado}
            name="id_grado"
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Fecha de Inscripción:
          <input
            type="date"
            value={formData.fecha_inscripcion}
            name="fecha_inscripcion"
            onChange={handleChange}
          />
        </label>
        <label>
          Año Lectivo:
          <input
            type="number"
            value={formData.anio_lectivo}
            name="anio_lectivo"
            onChange={handleChange}
          />
        </label>
        <label>
          Es Activo:
          <input
            type="checkbox"
            checked={formData.es_activo}
            name="es_activo"
            onChange={handleChange}
          />
        </label>
        <label>
          Fecha de Desmatriculación:
          <input
            type="date"
            value={formData.fecha_desmatriculacion || ""}
            name="fecha_desmatriculacion"
            onChange={handleChange}
          />
        </label>
        <label>
          Trabaja:
          <input
            type="checkbox"
            checked={formData.trabaja}
            name="trabaja"
            onChange={handleChange}
          />
        </label>
        <label>
          Es Interno:
          <input
            type="checkbox"
            checked={formData.es_interno}
            name="es_interno"
            onChange={handleChange}
          />
        </label>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
          <button type="button" className="ml-2 bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default MatriculaForm;
