import { useEffect, useState } from "react";
import {
  getMatricula,
  getGrados,
  getPeriodo,
  setMatriculaActive,
} from "../services/AcademicoService";
import { HiBars3, HiOutlineNewspaper } from "react-icons/hi2";
import { MdQrCodeScanner, MdSearch } from "react-icons/md";
import PaginationButtons from "../components/PaginationButtons";
import QrCode from "../components/matriculacion/QrCode";
import useAuth from "../hooks/useAuth";
import * as XLSX from "xlsx";
import { FaFileDownload } from "react-icons/fa";
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import MatriculaForm from "../components/MatriculaForm";
import Confirmacion from "../components/matriculacion/Confirmacion";
import toast from "react-hot-toast";
import DesmatricularModal from "../components/matriculacion/Desmatricular";
import { DateFormatter } from "../components/Constants";
import moment from "moment";

const MatriculacionPage = () => {
  const [periodoActual, setPeriodoActual] = useState();
  const [periodos, setPeriodos] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [matriculas, setMatriculas] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [qr_codeVisible, setQr_codeVisible] = useState(null);
  const { authTokens } = useAuth();
  const [grados, setGrados] = useState([]); // Estado para almacenar los grados
  const [editMatricula, setEditMatricula] = useState(null);
  const blueColor = "#3B82F6";
  const [reloadData, setReloadData] = useState(false); // Estado para forzar la recarga de datos
  const [filtros, setFiltros] = useState({
    search: "",
    grado: "",
    year: new Date().getFullYear(),
  });
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [matricula, setMatricula] = useState();
  const [showDesmatricularModal, setShowDesmatricularModal] = useState(false);

  useEffect(() => {
    const singleLoad = async () => {
      try {
        const res = await getGrados();
        setGrados(res.data); // Almacenar la lista de grados en el estado
        const res2 = await getPeriodo();
        setPeriodos(res2.data);
        const fs = res2.data.filter((periodo) => periodo.es_activo == true);
        setPeriodoActual(fs[0]);
      } catch (error) {
        toast.error(error.message);
      }
    };
    singleLoad();
  }, []);

  useEffect(() => {
    // Función para cargar las matrículas
    const loadMatriculas = async () => {
      try {
        // Obtener las matrículas con los filtros actuales
        const page = Math.min(currentPage + 1, totalPages);
        const res = await getMatricula(
          filtros.year,
          filtros.grado,
          filtros.search,
          page
        );
        setTotalPages(Math.ceil(res.data.count / 10));
        setMatriculas(res.data.results);
      } catch (error) {
        console.log("Error al cargar las matriculas:", error.message);
      }
    };
    loadMatriculas();
  }, [currentPage, filtros, reloadData]);

  const openNuevaMatricula = () => {
    const url =
      "http://localhost:5174/Inscripci%C3%B3n/?auth=" + authTokens.access;
    window.open(url, "_blank");
  };

  //Exportar lista de alumnos

  const exportAlumnos = async () => {
    try {
      let allAlumnos = [];
      const res = await getMatricula(
        filtros.year,
        filtros.grado,
        filtros.search
      );
      allAlumnos = res.data.map((alumno) => alumno.id_alumno);

      console.log("ALUMNOS: " + JSON.stringify(allAlumnos));

      const data = allAlumnos.map((alumno) => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        Cedula: alumno.cedula,
        "Fecha de Nacimiento": alumno.fecha_nac,
        Teléfono: alumno.telefono,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Alumnos");
      XLSX.writeFile(wb, "alumnos.xlsx");
    } catch (error) {
      console.error("Error al exportar los alumnos:", error);
    }
  };

  // handle change para los filtros
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFormValues) => {
      return {
        ...prevFormValues,
        [name]: value,
      };
    });
    setCurrentPage(0);
    setTotalPages(1);
  };

  //Editar matricula
  const handleEditMatricula = (matricula) => {
    setEditMatricula(matricula);
  };

  const handleCloseForm = () => {
    // Cerrar el formulario de edición y forzar la recarga de datos
    setEditMatricula(null);
    setReloadData((prev) => !prev); // Invertir el valor de reloadData
  };

  const handleDesmatricular = (m) => {
    console.log("desmatricular");
    setMatricula(m);
    setShowDesmatricularModal(true);
  };

  const desmatricular = () => {
    const hoy = moment(new Date()).format("YYYY-MM-DD");
    console.log("hoy", hoy);
    try {
      const res = setMatriculaActive(matricula.id_matricula, false, hoy);
      toast.promise(
        res,
        {
          loading: "Guardando",
          success: "Alumno desmatriculado",
          error: "Error al desmatricular al alumno",
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
          },
        }
      );
    } catch (error) {
      console.error(error.message);
    }
    setShowDesmatricularModal(false);
    setReloadData(!reloadData);
  };

  const handleConfirmar = (m) => {
    setMatricula(m);
    setShowConfirmacion(true);
  };

  const onCloseConfirmar = () => {
    setMatricula([]);
    setShowConfirmacion(false);
    setReloadData(!reloadData);
  };

  return (
    <>
      <DesmatricularModal
        show={showDesmatricularModal}
        onClose={() => setShowDesmatricularModal(false)}
        title={"Desmatricular"}
        information={
          "Alumno: " +
          matricula?.id_alumno?.nombre +
          " " +
          matricula?.id_alumno?.apellido
        }
        data={"Fecha de desmatriculacion: " + DateFormatter(new Date())}
        message={"Confirmar la desmatriculacion."}
        action={() => desmatricular()}
      />
      <QrCode show={qr_codeVisible} onClose={() => setQr_codeVisible(false)} />
      <Confirmacion
        show={showConfirmacion}
        onClose={onCloseConfirmar}
        periodoActual={periodoActual}
        matricula={matricula}
      />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-4xl font-bold">
            <HiOutlineNewspaper style={{ color: blueColor }} />
            <h1 className="text-lg">Matriculaciones</h1>
          </div>
          <div className="flex relative">
            <button
              className="flex p-2 gap-2 bg-blue-500 rounded-lg text-center text-white items-center px-5 py-2.5 "
              onMouseOver={() => setShowOptions(true)}
              onMouseLeave={() => setShowOptions(false)}
              onClick={() => openNuevaMatricula()}
            >
              Agregar Matriculación <HiBars3 className="text-2xl" />
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
                    onClick={() => setQr_codeVisible(true)}
                    className="  flex flex-row justify-between items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Inscripción Móvil
                    <MdQrCodeScanner className="text-2xl" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-row gap-3">
            <Label className="mr-2">
              Busqueda
              <TextInput
                icon={MdSearch}
                name="search"
                id="search"
                value={filtros.search}
                onChange={(e) => handleChange(e)}
                placeholder="Nombre. Apellido. CI."
              />
            </Label>
            <Label htmlFor="anio" className="mr-2">
              Grado
              <Select
                value={filtros.grado || ""}
                name="grado"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Todos</option>
                {grados.map((grado) => (
                  <option key={grado.id_grado} value={grado.id_grado}>
                    {grado.nombre}
                  </option>
                ))}
              </Select>
            </Label>
            <Label className="mr-2">
              Periodo
              <Select
                value={filtros.year}
                name="year"
                onChange={(e) => handleChange(e)}
              >
                <option value="">Seleccionar Año</option>
                {Array.from(
                  { length: 15 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </Label>
          </div>
          {/* </div> */}

          <Button
            className="flex flex-wrap bg-blue-500 self-end"
            onClick={exportAlumnos}
          >
            <FaFileDownload className="mr-2 h-5 w-5" />
            Descargar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <Table.Head className="bg-gray-100">
              <Table.HeadCell>Nro. Documento</Table.HeadCell>
              <Table.HeadCell>Alumno</Table.HeadCell>
              <Table.HeadCell>Grado</Table.HeadCell>
              <Table.HeadCell>Origen</Table.HeadCell>
              <Table.HeadCell>Estado</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Acciones</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {matriculas.map((matricula) => (
                <Table.Row
                  key={matricula.id_matricula}
                  className="hover:bg-gray-100"
                >
                  <Table.Cell>{matricula.id_alumno?.cedula}</Table.Cell>
                  <Table.Cell>
                    {matricula.id_alumno?.nombre}{" "}
                    {matricula.id_alumno?.apellido}
                  </Table.Cell>
                  <Table.Cell>
                    {matricula.id_grado?.grado
                      ? matricula.id_grado?.grado + "°"
                      : matricula.id_grado?.nombre}
                  </Table.Cell>
                  <Table.Cell>
                    {matricula.es_interno ? "FUNDACION" : "EXTERNO"}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {matricula.es_activo &&
                      matricula.anio_lectivo === periodoActual?.periodo
                        ? "Activo"
                        : matricula.fecha_desmatriculacion != null
                        ? "Desmatriculado"
                        : "Inactivo"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {matricula.fecha_desmatriculacion == null && (
                      <button
                        className="bg-blue-500 m-1 text-white font-bold py-1 px-3 rounded"
                        onClick={() => handleEditMatricula(matricula)}
                      >
                        Editar
                      </button>
                    )}
                    {!matricula.fecha_desmatriculacion && (
                      <button
                        className={`text-white font-bold py-1 px-3 rounded ${
                          matricula.es_activo ? "bg-red-700" : "bg-yellow-300"
                        }`}
                        onClick={
                          matricula.es_activo
                            ? () => handleDesmatricular(matricula)
                            : () => handleConfirmar(matricula)
                        }
                      >
                        {matricula.es_activo ? "Desmatricular" : "Confirmar"}
                      </button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <PaginationButtons
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage} // Pasar setCurrentPage como prop
        />
      </div>
      {editMatricula && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-12 rounded shadow-lg">
            <MatriculaForm
              matricula={editMatricula}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MatriculacionPage;
