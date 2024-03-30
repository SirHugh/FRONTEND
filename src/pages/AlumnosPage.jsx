import { useEffect, useState } from "react";
import { getAlumnos } from "../services/AcademicoService";
import AlumnoCard from "../components/AlumnoCard";
import PaginationButtons from "../components/PaginationButtons";
import { Link } from "react-router-dom";

export default function AlumnosPage() {
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function loadAlumnos() {
      const page = Math.min(currentPage + 1, totalPages);
      console.log("page n°: " + page);
      const res = await getAlumnos(page);

      setPages(res.data.data);
      setLoading(false);
      setTotalPages(res.data.number_of_pages);
      console.log("response: ", res.data);
    }
    loadAlumnos();
  }, [currentPage]);

  return (
    <div>
      <div className="">
        <Link
          to="/alumnos/nuevo"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Agregar
        </Link>
      </div>
      <div className="font-Poppins section">
        {loading ? (
          <div className="text-center text-5xl">Cargando...</div>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              {pages.map((student) => (
                <AlumnoCard key={student.id_alumno} alumno={student} />
              ))}
            </div>
            <PaginationButtons
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
