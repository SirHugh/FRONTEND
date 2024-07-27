import AsyncSelect from "react-select/async";
import { searchMatricula } from "../../services/AcademicoService";
import { useState } from "react";

function DatosAlumno({ setData }) {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  const loadOptions = async () => {
    if (inputValue.length < 2) return;
    return searchMatricula(true, inputValue, 1).then((result) => {
      const res = result.data.results;
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = async (value) => {
    setSelecteValue(value);
    setData(value.id_matricula);
    console.log("Alumno: ", value);
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p>Datos Alumno</p>
        <div className="flex flex-col w-72">
          <AsyncSelect
            noOptionsMessage={() => "No se encuentran resultados"}
            placeholder="Buscar Alumno..."
            cacheOptions
            defaultOptions
            value={selectedValue}
            loadOptions={loadOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
            getOptionLabel={(e) =>
              e.id_alumno.nombre + " " + e.id_alumno.apellido
            }
            getOptionValue={(e) => e.id_matricula}
          />
        </div>
      </div>
      <div className="flex w-full h-14 rounded pt-8 mb-5">
        {selectedValue ? (
          <div className="flex flex-row gap-5">
            <span>
            <b>Cedula: </b>
            {selectedValue?.id_alumno.cedula}
          </span>
          <span>
            <b>Nombre: </b>
            {selectedValue?.id_alumno.nombre}
          </span>
          <span>
            <b>Apellido: </b>
            {selectedValue?.id_alumno.apellido}
          </span>
          <span>
            <b>Grado: </b>
            {selectedValue?.id_grado.grado}°
          </span>
           
          </div>  
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default DatosAlumno;
