import AsyncSelect from "react-select/async";
import { getMatricula } from "../../services/AcademicoService";
import { useState } from "react";

function DatosAlumno({ setData }) {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  const loadOptions = async () => {
    if (inputValue.length < 2) return;
    return getMatricula("", "", inputValue, 1).then((result) => {
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
      <div className="flex w-full border rounded-md p-3  h-14">
        {selectedValue ? (
          selectedValue?.id_matricula +
          " - " +
          selectedValue?.id_alumno?.cedula +
          " - " +
          selectedValue?.id_alumno?.nombre +
          " " +
          selectedValue?.id_alumno?.apellido +
          " - " +
          selectedValue?.id_grado?.nombre
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default DatosAlumno;
