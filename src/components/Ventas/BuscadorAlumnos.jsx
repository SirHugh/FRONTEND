import React, { useState } from "react";
import { TextInput, Button } from "flowbite-react";
import { MdSearch } from "react-icons/md";
import { searchAlumnos } from "../../services/AcademicoService";

function BuscadorAlumnos({ onAlumnoSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [alumnos, setAlumnos] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchAlumnos(1, searchTerm); // Ajusta los parámetros de la búsqueda según sea necesario
      console.log("Datos de los alumnos: " + JSON.stringify(response.data.results));
      setAlumnos(response.data.results);
    } catch (error) {
      console.error("Error al buscar alumnos:", error);
    }
  };

  const handleAlumnoClick = (id) => {
    onAlumnoSelect(id);
    setAlumnos([]); // Borra los resultados de la búsqueda
    setSearchTerm(""); // Limpia el término de búsqueda
  };

  return (
    <>
      <div className="flex flex-row h-20 items-center space-x-2 w-80">
        <TextInput
          icon={MdSearch}
          name="search"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nombre, Apellido o CI."
          className="flex-grow"
        />
        <Button className="bg-blue-500" onClick={handleSearch}>
          Buscar
        </Button>
      </div>
      {alumnos.length > 0 && (
        <div className="mt-4">
          <ul>
            {alumnos.map((alumno) => (
              <li
                key={alumno.id}
                onClick={() => handleAlumnoClick(alumno.id_alumno)}
                className="cursor-pointer"
              >
                {alumno.nombre} {alumno.apellido} - {alumno.cedula}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default BuscadorAlumnos;
