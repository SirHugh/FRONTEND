import { useNavigate } from "react-router-dom";
import NoImage from "../assets/no-image.png";
import { useState } from "react";

const AlumnoCard = ({ alumno }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlumno, setEditedAlumno] = useState(alumno);
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAlumno({
      ...editedAlumno,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedAlumno); // Llama a la función de manejo para enviar los datos actualizados
  };

  return (
    <div
      className="flex flex-row gap-3 border-2 rounded-md hover:bg-sky-100 cursor-pointer"
      onClick={() => {
        navigate(`/alumno/${alumno.id_alumno}`);
      }}
    >
      <div className="flex w-20 justify-center">
        <img
          src={alumno.fotocarnet || NoImage}
          alt=""
          className="rounded-full w-14 h-14 self-center"
        />
      </div>
      <div className="p-2 w-full h-full flex flex-col rounded-md">
        <h1>
          {alumno.nombre}, {alumno.apellido}
        </h1>
        <div className="flex flex-row gap-2  text-slate-500 text-sm">
          <span>Cedula: {alumno.cedula}</span>
          <span>Fecha de Nacimiento: {alumno.fecha_nac}</span>
          <span>telefono: {alumno.telefono}</span>
        </div>
        <h1></h1>
      </div>
    </div>
  );
};

export default AlumnoCard;
