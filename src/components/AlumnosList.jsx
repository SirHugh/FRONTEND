import { useEffect, useState } from "react";
import { getAlumnos } from "../services/AcademicoService";
import AlumnoCard from "./AlumnoCard";

export const AlumnosList = () => {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    async function loadAlumnos() {
      const res = await getAlumnos();
      setAlumnos(res.data);
    }
    loadAlumnos();
  }, []);

  return (
    <div>
      {alumnos.map((alumno) => (
        <AlumnoCard key={alumno.id_alumno} alumno={alumno} />
      ))}
    </div>
  );
};
