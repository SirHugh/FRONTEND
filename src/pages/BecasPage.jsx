import { useEffect, useState } from "react";
import { FaPlus, FaToggleOff, FaToggleOn, FaUsers } from "react-icons/fa6";
import { MdGroupAdd, MdSearch } from "react-icons/md";
import {
  getBecados,
  getBecadosBeca,
  getBecas,
  searchBecado,
} from "../services/AcademicoService";
import { FaFileDownload, FaRegEdit } from "react-icons/fa";
import PaginationButtons from "../components/PaginationButtons";
import { Button, Table } from "flowbite-react";
import { TbCertificate, TbCertificateOff, TbListSearch } from "react-icons/tb";
import AlumnoSetActiveModal from "../components/Becas/AlumnoActivoModal";
import AgregarBecadoModal from "../components/Becas/AgregarBecadoModal";
import BecaActiveModal from "../components/Becas/BecaActiveModal";
import AgregarBecaModal from "../components/Becas/AgregarBecaModal";
import { Toaster } from "react-hot-toast";

function BecasPage() {
  const [becas, setBecas] = useState([]);
  const [becados, setBecados] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const becaType = {
    id_beca: "",
    nombre: "",
    descripcion: "",
    monto: 0,
    porcentaje: 0,
    es_activo: false,
  };
  const [beca, setBeca] = useState(becaType);
  const [edit, setEdit] = useState(false);
  const [changed, setChanged] = useState(false);
  const [showAddBecadoModal, setShowAddBecadoModal] = useState(false);
  const [showQuitarBecadoModal, setShowQuitarBecadoModal] = useState(false);
  const [becado, setBecado] = useState();
  const [becadosTitle, setBecadosTitle] = useState();
  const blueColor = "#3B82F6";

  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await getBecas();
        setBecas(res1.data);
      } catch (error) {
        console.error("Error al cargar los becados:", error);
      }
    };
    load();
    setBecadosTitle("TODOS");
  }, [changed]);

  useEffect(() => {
    const load = async () => {
      try {
        const page = Math.min(currentPage + 1, totalPages);
        const res2 = await getBecados(page);
        setTotalPages(Math.ceil(res2.data.count / 10));
        setBecados(res2.data.results);
      } catch (error) {
        console.error("Error al cargar los becados:", error);
      }
    };
    load();
  }, [currentPage, changed]);

  function onCloseModal() {
    setShowModal(false);
    setEdit(false);
    setShowActivateModal(false);
    setBeca(becaType);
  } // Cierra el modal

  const handdleEdit = (b) => {
    setBeca(b);
    setEdit(true);
    setShowModal(true);
  };

  const handdleActivate = (b) => {
    setBeca(b);
    setShowActivateModal(true);
  };

  const cargarBecados = async (b) => {
    setBecadosTitle(b.nombre);
    try {
      const res = await getBecadosBeca(b.id_beca);
      if (res.status === 200) {
        setTotalPages(Math.ceil(res.data.count / 10));
        setBecados(res.data.results);
      }
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
  };

  const handdleSearch = async (e) => {
    setBecadosTitle("TODOS");
    try {
      const res = await searchBecado(e.target.value);
      if (res.status === 200) {
        setTotalPages(Math.ceil(res.data.count / 10));
        setBecados(res.data.results);
      }
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      console.error("Error al activar", error);
    }
  };

  const onCloseAddBecado = () => {
    setShowAddBecadoModal(false);
  };

  const handdleAddBecado = (b) => {
    setShowAddBecadoModal(true);
    setBeca(b);
  };

  const onCloseQuitarModal = () => {
    setShowQuitarBecadoModal(false);
  };

  return (
    <>
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <TbCertificate style={{ color: blueColor }} />
          <h1 className="">BECAS</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap bg-blue-500 "
              onClick={() => setShowModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Agregar Beca</h1>
            </Button>
          </div>
        </div>
        <div>
          <div className="w-full  mx-auto bg-white rounded-lg shadow-lg">
            <Table>
              <Table.Head>
                <Table.HeadCell>NOMBRE</Table.HeadCell>
                <Table.HeadCell>DESCRIPCION</Table.HeadCell>
                <Table.HeadCell>MONTO</Table.HeadCell>
                <Table.HeadCell>PORCENTAJE</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Mostrar</span>
                </Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Agregar</span>
                </Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Editar</span>
                </Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Estado</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {becas.map((b) => (
                  <Table.Row
                    key={b.id_beca}
                    className={`bg-white hover:border-l-4 hover:border-l-blue-500 justify-start cursor-default ${
                      b.es_activo == false ? `bg-red-400` : ``
                    }`}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {b.nombre}
                    </Table.Cell>
                    <Table.Cell>{b.descripcion}</Table.Cell>
                    <Table.Cell>{b.monto}. Gs.</Table.Cell>
                    <Table.Cell>
                      {b.porcentaje ? b.porcentaje + " %" : ""}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => cargarBecados(b)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500  cursor-pointer"
                      >
                        <TbListSearch
                          title="Mostrar Lista"
                          className="size-6"
                          style={{ color: blueColor }}
                        />
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        disabled
                        onClick={() => {
                          b.es_activo ? handdleAddBecado(b) : "";
                        }}
                        className={`font-medium  hover:underline dark:text-cyan-500  ${
                          b.es_activo
                            ? "cursor-pointer text-blue-500"
                            : "text-gray-600"
                        }`}
                      >
                        <MdGroupAdd
                          title="Agregar Estudiante"
                          className="size-6"
                        />
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => handdleEdit(b)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500  cursor-pointer"
                      >
                        <FaRegEdit
                          title="Modificar Beca"
                          className="size-6"
                          style={{ color: blueColor }}
                        />
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => handdleActivate(b)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500  cursor-pointer"
                      >
                        {b.es_activo ? (
                          <FaToggleOn
                            title="Desactivar"
                            className="size-6 text-blue-500"
                          />
                        ) : (
                          <FaToggleOff
                            title="Activar"
                            className="size-6 text-red-800"
                          />
                        )}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between p-3 items-center">
            <div className="flex flex-row p-2 gap-3 items-center justify-between font-bold text-2xl">
              <FaUsers style={{ color: blueColor }} />
              <h1>Becados: </h1>
              <h1 className="text-xl font-medium ">
                {becadosTitle ? becadosTitle : "Todos"}
              </h1>
            </div>

            <div className="w-80 relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <MdSearch className="size-6" />
              </div>
              <input
                type="search"
                id="search"
                name="search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar Becado..."
                onChange={(e) => {
                  handdleSearch(e);
                }}
                required
              />
            </div>
          </div>
          <div className="h-1/3">
            <Table className="w-full bg-white ">
              <Table.Head>
                <Table.HeadCell>CEDULA</Table.HeadCell>
                <Table.HeadCell>NOMBRE</Table.HeadCell>
                <Table.HeadCell>APELLIDO</Table.HeadCell>
                <Table.HeadCell>GRADO</Table.HeadCell>
                <Table.HeadCell>ORIGEN</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only justify-end">QUITAR</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className=" divide-y">
                {becados.map((becado) => (
                  <Table.Row
                    key={becado.id}
                    className={`cursor-default hover:border-l-4 hover:border-l-blue-500  justify-start ${
                      becado.es_activo == false ? `bg-red-300` : ``
                    }`}
                    onClick={() => console.log("clicked")}
                  >
                    <Table.Cell>
                      {becado.id_matricula.id_alumno.cedula}
                    </Table.Cell>
                    <Table.Cell>
                      {becado.id_matricula.id_alumno.nombre}
                    </Table.Cell>
                    <Table.Cell>
                      {becado.id_matricula.id_alumno.apellido}
                    </Table.Cell>
                    <Table.Cell>
                      {becado.id_matricula.id_grado.grado}° -{" "}
                      {becado.id_matricula.id_grado.nombre}
                    </Table.Cell>
                    <Table.Cell>
                      {becado.id_matricula.es_interno == true
                        ? "Fundacion"
                        : "Externo"}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => {
                          setShowQuitarBecadoModal(true);
                          setBecado(becado);
                          console.log(becado);
                        }}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      >
                        {becado.es_activo ? (
                          <TbCertificate
                            title="Remover Beca"
                            className="size-6"
                            style={{ color: blueColor }}
                          />
                        ) : (
                          <TbCertificateOff className="text-red-800 size-6" />
                        )}
                      </a>
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
      </div>

      {/* Agregar Beca Modal */}

      <AgregarBecaModal
        show={showModal}
        onClose={onCloseModal}
        beca={beca}
        setBeca={setBeca}
        edit={edit}
        changed={changed}
        setChanged={setChanged}
      />

      <BecaActiveModal
        show={showActivateModal}
        onClose={onCloseModal}
        beca={beca}
        setBeca={setBeca}
        changed={changed}
        setChanged={setChanged}
      />

      <AgregarBecadoModal
        show={showAddBecadoModal}
        onClose={onCloseAddBecado}
        beca={beca}
        changed={changed}
        setChanged={setChanged}
      />

      <AlumnoSetActiveModal
        show={showQuitarBecadoModal}
        onClose={onCloseQuitarModal}
        becado={becado}
        changed={changed}
        setChanged={setChanged}
      />
    </>
  );
}

export default BecasPage;
