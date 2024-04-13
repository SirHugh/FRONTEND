import { useEffect, useState } from "react";
import { getMatriculaAnioGrado } from "../services/AcademicoService";
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

  return (
    <>
      <div className="h-full">
        <div className="flex w-full h-16 p-3 justify-between border-b">
          <div className="flex items-center p-2 gap-3 text-4xl font-bold">
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
        <div className="flex p-2 gap-2 items-center justify-end">
          <label htmlFor="anio" className="p-2">
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
        <div className="w-full items-start bg-black">
          <table className="w-full">
            <thead></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="text-right hover:bg-slate-500 cursor-pointer">
                <td> </td>
                <td className="text-right pr-4"> </td>
                <td> </td>
                <td> </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full h-3/4">
          <div className="flex flex-col p-2 gap-2">
            {matriculas.map((matricula) => (
              <div
                key={matricula.id_matricula}
                className="flex h-14 border border-black rounded-md "
              >
                {matricula.id_alumno.nombre} {matricula.id_alumno.apellido}
              </div>
            ))}
          </div>
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
