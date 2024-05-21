import React, { useState, useEffect } from "react";
import { updateMatricula, getGrados } from "../services/AcademicoService";
import { Button, Checkbox, TextInput, Select } from "flowbite-react";

const MatriculaForm = ({ matricula, onClose }) => {
  const [formData, setFormData] = useState({
    id_alumno: matricula.id_alumno.id_alumno,
    id_grado: matricula.id_grado.id_grado,
    fecha_inscripcion: matricula.fecha_inscripcion,
    anio_lectivo: matricula.anio_lectivo,
    es_activo: matricula.es_activo,
    fecha_desmatriculacion: matricula.fecha_desmatriculacion,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="id_alumno">ID del alumno:</label>
        <TextInput
          type="text"
          value={formData.id_alumno}
          name="id_alumno"
          onChange={handleChange}
          readOnly={true}
        />
      </div>
      <div>
        <label htmlFor="id_grado">Grado:</label>
        <Select
          value={formData.id_grado}
          name="id_grado"
          onChange={handleChange}
        >
          {grados.map((grado) => (
            <option key={grado.id_grado} value={grado.id_grado}>
              {grado.nombre}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor="fecha_inscripcion">Fecha de Inscripción:</label>
        <TextInput
          type="date"
          value={formData.fecha_inscripcion}
          name="fecha_inscripcion"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="anio_lectivo">Año Lectivo:</label>
        <TextInput
          type="number"
          value={formData.anio_lectivo}
          name="anio_lectivo"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="es_activo">Es Activo:</label>
        <Checkbox
          checked={formData.es_activo}
          name="es_activo"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="fecha_desmatriculacion">Fecha de Desmatriculación:</label>
        <TextInput
          type="date"
          value={formData.fecha_desmatriculacion || ""}
          name="fecha_desmatriculacion"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="trabaja">Trabaja:</label>
        <Checkbox
          checked={formData.trabaja}
          name="trabaja"
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="es_interno">Es Interno:</label>
        <Checkbox
          checked={formData.es_interno}
          name="es_interno"
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Guardar
        </Button>
        <Button type="button" className="ml-2 bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MatriculaForm;
