import { useEffect, useState } from "react";
import {
  getMatriculaAnioGrado,
  setMatriculaActive,
} from "../services/AcademicoService";
import { HiBars3, HiOutlineNewspaper } from "react-icons/hi2";
import { MdQrCodeScanner, MdSearch } from "react-icons/md";
import PaginationButtons from "../components/PaginationButtons";
import QrCode from "../components/QrCode";
import useAuth from "../hooks/useAuth";

const MatriculacionPage = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [matriculas, setMatriculas] = useState([]);
  const [search, setSearch] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [qr_code, setQr_code] = useState(null);
  const { authTokens } = useAuth();

  const { user } = useAuth();

  useEffect(() => {
    const loadMatriculas = async () => {
      const page = Math.min(currentPage + 1, totalPages);
      const res = await getMatriculaAnioGrado("", "", page);
      console.log("Got Matriculas: ", res);
      if (res.status == 200) {
        setTotalPages(Math.ceil(res.data.count / 10));
        setMatriculas(res.data.results);
      } else {
        console.error("Error al cargar las matriculas:", res.message);
      }
    };
    loadMatriculas();
    console.log("Usuario: ", user.groups);
  }, [currentPage]);

  const setModalVisible = (value) => {
    if (value) {
      document.getElementById("my_modal_1").showModal();
      setQr_code(<QrCode />);
    }
  };

  const openNuevaMatricula = () => {
    const url =
      "http://localhost:5174/Inscripci%C3%B3n/?auth=" + authTokens.access;
    window.open(url, "_blank");
  };

  const handleToggleChange = async (id, value) => {
    try {
      await setMatriculaActive(id, value);
      // Actualizar las matriculaciones después de cambiar el estado
      const page = Math.min(currentPage + 1, totalPages);
      const res = await getMatriculaAnioGrado("", "", page);
      if (res.status === 200) {
        setMatriculas(res.data.results);
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la matriculación:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-4xl font-bold">
            <HiOutlineNewspaper />
            <h1 className="text-lg">Matriculaciones</h1>
          </div>
          <div className="flex relative">
            <button
              className="flex p-2 gap-2 bg-blue-700 rounded-lg text-center text-white items-center px-5 py-2.5 "
              onMouseOver={() => setShowOptions(true)}
              onMouseLeave={() => setShowOptions(false)}
              onClick={() => openNuevaMatricula()}
            >
              Agregar Matriculacion <HiBars3 className="text-2xl" />
            </button>
            <div
              id="dropdownHover"
              onMouseOver={() => setShowOptions(true)}
              onMouseLeave={() => setShowOptions(false)}
              className={`absolute right-0 top-10 z-10 bg-white divide-y divide-gray-100 border rounded-lg shadow w-44 dark:bg-gray-700 ${
                showOptions ? "" : "hidden"
              }`}
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownHoverButton"
              >
                <li>
                  <button
                    onClick={() => setModalVisible(true)}
                    className="  flex flex-row justify-between items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Inscripcion Mobil
                    <MdQrCodeScanner className="text-2xl" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="anio" className="mr-2">
            Busqueda
          </label>
          <input
            name="search"
            id="search"
            className="w-60 h-12 bg-white p-3 focus-within:border-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre. Apellido. Grado"
          ></input>
          <button>
            <MdSearch />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Apellido</th>
                <th className="px-4 py-2">Grado</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((matricula) => (
                <tr
                  key={matricula.id_matricula}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td style={{ width: "20%" }} className="px-4 py-2">
                    {matricula.id_alumno.nombre}
                  </td>
                  <td style={{ width: "20%" }} className="px-4 py-2">
                    {matricula.id_alumno.apellido}
                  </td>
                  <td style={{ width: "20%" }} className="px-4 py-2">
                    {matricula.id_grado.grado}
                    {" - "}
                    {matricula.id_grado.nombre}
                  </td>
                  <td style={{ width: "40%" }} className="px-4 py-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={matricula.es_activo}
                        onChange={(e) =>
                          handleToggleChange(
                            matricula.id_matricula,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ${
                          matricula.es_activo
                            ? "peer-checked:bg-blue-600"
                            : "dark:bg-gray-700 peer-checked:bg-gray-600"
                        } dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}
                      ></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {matricula.es_activo ? "Activo" : "Inactivo"}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
        />
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_1" className="modal bg-white">
        <div className="">
          <div className="py-1">{qr_code}</div>
          <div className="modal-action flex justify-end p-3">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="border p-2 bg-blue-700 rounded-md text-white"
                onClick={() => setQr_code(null)}
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MatriculacionPage;