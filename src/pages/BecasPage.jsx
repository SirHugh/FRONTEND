import { useEffect, useState } from "react";
import { FaPlus, FaUsers } from "react-icons/fa6";
import { MdWorkspacePremium } from "react-icons/md";
import { getBecados, getBecas } from "../services/AcademicoService";
import { IoPersonRemoveSharp } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";
import PaginationButtons from "../components/PaginationButtons";

function BecasPage() {
  const [search, setSearch] = useState("");
  const [becas, setBecas] = useState([]);
  const [becados, setBecados] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res1 = await getBecas();
      if (res1.status === 200) {
        setBecas(res1.data);
        const res2 = await getBecados();
        if (res2.status === 200) {
          setTotalPages(Math.ceil(res2.data.count / 10));
          setBecados(res2.data.results);
        } else {
          console.error("Error al cargar los becados:", res2.message);
        }
      } else {
        console.error("Error al cargar las becas:", res1.message);
      }
    };
    load();
  }, []);

  return (
    <>
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <MdWorkspacePremium className="text-yellow-600" />
          <h1 className="">Beca</h1>
        </div>
        <div className="flex flex-row justify-between p-3 gap-3 border items-center">
          <div className="flex items-center mb-4">
            <label htmlFor="search" className="mr-2">
              Buscar
            </label>
            <input
              type="text"
              name="search"
              id="search"
              className="w-50 h-14 px-3 bg-white border border-black rounded-full hover:outline"
              value={search}
              placeholder="Buscar"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <button className="flex flex-row p-2 gap-3 h-14 items-center justify-center border border-gray-600">
              <FaPlus></FaPlus>
              <h1>Agregar Beca</h1>
            </button>
          </div>
        </div>
        <div>
          <div className="flex flex-row px-10 bg-slate-400">
            <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr className="bg-slate-300 h-12 text-slate-600">
                  <th className="px-4 py-2">NOMBRE</th>
                  <th className="px-4 py-2">DESCRIPCION</th>
                  <th className="px-4 py-2">MONTO</th>
                  <th className="px-4 py-2">PORCENTAJE</th>
                </tr>
              </thead>
              <tbody>
                {becas.map((beca) => (
                  <tr
                    key={beca.id_grado}
                    className={`cursor-pointer hover:bg-gray-500 justify-start ${
                      beca.es_activo == false ? `bg-red-400` : ``
                    }`}
                    onClick={() => console.log("clicked")}
                  >
                    <td className="px-4 py-2">{beca.nombre}</td>
                    <td className="px-4 py-2">{beca.descripcion}</td>
                    <td className="px-4 py-2">{beca.monto}</td>
                    <td className="px-4 py-2">
                      {beca.porcentaje ? beca.porcentaje + " %" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between p-3 items-center">
            <div className="flex flex-row p-2 gap-3 items-center justify-between font-bold text-2xl">
              <FaUsers />
              <h1>Becados</h1>
            </div>
            <div className="flex flex-row gap-1">
              <button className="flex flex-row p-2 gap-3 h-14 w-28 items-center justify-center border border-gray-600">
                <FaPlus></FaPlus>
                Agregar
              </button>
              <button className="flex flex-row p-2 gap-3 h-14 w-28 items-center justify-center border border-gray-600">
                <IoPersonRemoveSharp />
                Remover
              </button>
              <button className="flex flex-row p-2 gap-3 h-14 w-28 items-center justify-center border border-gray-600">
                <FaFileDownload />
                Descargar
              </button>
            </div>
          </div>
          <div>
            <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
              <thead></thead>
              <tbody>
                {becados.map((becado) => (
                  <tr
                    key={becado.id}
                    className={`cursor-pointer hover:bg-gray-500 justify-start ${
                      becado.es_activo == false ? `bg-red-300` : ``
                    }`}
                    onClick={() => console.log("clicked")}
                  >
                    <td className="px-4 py-2">
                      {becado.id_matricula.id_alumno.cedula}
                    </td>
                    <td className="px-4 py-2">
                      {becado.id_matricula.id_alumno.nombre}
                    </td>
                    <td className="px-4 py-2">
                      {becado.id_matricula.id_alumno.apellido}
                    </td>
                    <td className="px-4 py-2">
                      {becado.id_matricula.es_interno == true
                        ? "Fundacion"
                        : "Externo"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationButtons
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BecasPage;

{
  /* BECADO DATASTRUCTURE
{"id": 1,
"id_beca": 1,
"id_matricula": {
  "id_matricula": 5,
  "id_alumno": {
    "id_alumno": 60,
    "nombre": "Ana",
    "apellido": "Barboza",
    "cedula": 500761,
    "fecha_nac": "2024-04-24",
    "telefono": "4234343",
    "fotocarnet": null
  },
  "fecha_inscripcion": "2024-04-09",
  "anio_lectivo": 2024,
  "es_activo": false,
  "fecha_desmatriculacion": null,
  "trabaja": false,
  "es_interno": true,
  "id_grado": 4
},
"es_activo": true,
"fecha_inicio": "2024-02-15"
}, */
}
