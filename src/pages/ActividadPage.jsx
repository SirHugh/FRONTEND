import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { BiBlock, BiCalendar, BiCalendarPlus } from "react-icons/bi";
import TablaActividades from "../components/Actividad/TablaActividades";
import NuevaActividad from "../components/Actividad/NuevaActividad";
import { getGrados } from "../services/AcademicoService";

function ActividadPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");
  const [grados, setGrados] = useState([]);
  const [grado, setGrado] = useState("");

  useEffect(() => {
    getGrados(true).then((res) => setGrados(res.data));
  }, []);

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <BiCalendar className="text-blue-500" />
        <h1 className="">Actividades</h1>
      </div>
      <div className="flex flex-row justify-between h-20 px-6 gap-3 border items-center">
        <div>
          {!ShowAgregar ? (
            <div className="flex flex-row gap-2">
              <TextInput
                icon={MdSearch}
                name="search"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Actividad..."
              />
              <Select
                placeholder="grados..."
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
              >
                <option value="">Todos los Grados</option>
                {grados.map((grado) => (
                  <option key={grado.id_grado} value={grado.id_grado}>
                    {grado.nombre}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            ""
          )}
        </div>
        <Button
          className="flex flex-wrap bg-blue-500"
          onClick={() =>
            ShowAgregar ? setShowAgregar(false) : setShowAgregar(true)
          }
        >
          {ShowAgregar ? (
            <>
              <BiBlock className="mr-2 h-5 w-5" />
              <h1>Cancelar</h1>
            </>
          ) : (
            <>
              <BiCalendarPlus className="mr-2 h-5 w-5" />
              <h1>Agregar Actividad</h1>
            </>
          )}
        </Button>
      </div>
      {ShowAgregar ? (
        <NuevaActividad onClose={() => setShowAgregar(false)} />
      ) : (
        <TablaActividades search={search} grado={grado} />
      )}
    </>
  );
}

export default ActividadPage;
