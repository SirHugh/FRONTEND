import {
  Button,
  Select,
  Table,
  TextInput,
  Textarea,
  Tooltip,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiCalendarPlus, BiEditAlt, BiSave, BiTrash } from "react-icons/bi";
import {
  createActividad,
  createTipoActividad,
  getTipoActividad,
  updateTipoActividad,
} from "../../services/CajaService";
import { MdSearch } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { getGrados } from "../../services/AcademicoService";
import { HiOutlineTrash } from "react-icons/hi";
import { CurrencyFormatter, DateFormatter } from "../Constants";

function NuevaActividad({ onClose }) {
  const { user } = useAuth();
  const [tipoActividades, setTipoActividades] = useState([]);
  const [search, setSearch] = useState("");
  const defaultTipoActividad = {
    id_tipoActividad: null,
    nombre: "",
    descripcion: "",
  };
  const [defaultActividad, setDefaultActividad] = useState({
    id_usuario: user.user_id,
    id_grado: null,
    fecha: "",
    monto: 0,
    id_tipoActividad: null,
  });
  const [actividad, setActividad] = useState(defaultTipoActividad);
  const [edit, setEdit] = useState(false);
  const focusNombreRef = useRef(null);
  const focusDescripcionRef = useRef(null);
  const focusGradoRef = useRef(null);
  const focusFechaRef = useRef(null);
  const focusMontoRef = useRef(null);
  const [reload, setReload] = useState(false);
  const [actividadGrados, setActividadGrados] = useState([]);
  const [grados, setGrados] = useState([]);

  useEffect(() => {
    const loadGrados = async () => {
      try {
        const res = await getGrados(true);
        setGrados(res.data);
      } catch (error) {
        toast.error("No se pudo cargar los grados");
      }
    };
    loadGrados();
  }, []);
  useEffect(() => {
    const Load = async () => {
      try {
        const res = await getTipoActividad(1, search);
        setTipoActividades(res.data.results);
      } catch (error) {
        toast.error(error.message);
      }
    };
    Load();
  }, [search, reload]);

  const handleSelectActividad = (value) => {
    setActividad(tipoActividades[value]);
    console.log(tipoActividades[value].id_tipoActividad);
    defaultActividad.id_tipoActividad = tipoActividades[value].id_tipoActividad;
    setActividadGrados([]);
    setEdit(false);
  };

  const handleAdd = () => {
    setActividad(defaultTipoActividad);
    defaultActividad.fecha = "";
    defaultActividad.id_grado = null;
    defaultActividad.monto = 0;
    defaultActividad.id_tipoActividad = null;
    setActividadGrados([]);
    setEdit(true);
    focusNombreRef.current.focus();
  };

  const handleCancel = () => {
    setActividad(defaultTipoActividad);
    setEdit(false);
  };

  const handleEdit = () => {
    setActividadGrados([]);
    defaultActividad.fecha = "";
    defaultActividad.id_grado = null;
    defaultActividad.monto = 0;
    defaultActividad.id_tipoActividad = null;
    setEdit(true);
    focusNombreRef.current.focus();
  };

  const validateActividad = () => {
    if (actividad.nombre.trim() === "") {
      toast.error("El nombre es requerido");
      focusNombreRef.current.focus();
      return false;
    }
    if (actividad.descripcion.trim() === "") {
      toast.error("La descripcion es requerida");
      focusDescripcionRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateActividad()) return;
    try {
      if (actividad.id_tipoActividad) {
        await updateTipoActividad(actividad.id_tipoActividad, actividad);
        toast.success("Tipo de actividad actualizado con éxito");
      } else {
        await createTipoActividad(actividad);
        toast.success("Tipo de actividad creado con éxito");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setEdit(false);
    setActividad(defaultTipoActividad);
    setReload(!reload);
  };
  const validateInfoActividad = () => {
    if (defaultActividad.id_grado === null) {
      toast.error("El grado para la actividad es requerida");
      focusGradoRef.current.focus();
      return false;
    }
    if (defaultActividad.fecha === "") {
      toast.error("La fecha de la actividad es requerida");
      focusFechaRef.current.focus();
      return false;
    }
    if (defaultActividad.monto === 0) {
      toast.error("El monto de la actividad es requerido");
      focusMontoRef.current.focus();
      return false;
    }
    return true;
  };

  const handleAddGrado = () => {
    if (!validateInfoActividad()) return;
    setActividadGrados([...actividadGrados, { ...defaultActividad }]);
    defaultActividad.id_grado = null;
    console.log(actividadGrados);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name == "id_grado" || name == "monto") value = parseInt(value);
    setDefaultActividad({ ...defaultActividad, [name]: value });
    console.log("defaultActividad", defaultActividad);
  };

  const handleRemoveItem = (indexItem) => {
    setActividadGrados(
      actividadGrados.filter((item, index) => index !== indexItem)
    );
  };

  const handleSubmit = async () => {
    if (window.confirm("Confirmar accion para guardar la actidad")) {
      try {
        console.log(actividadGrados);
        await createActividad(actividadGrados);
        toast.success("Actividad creada con exito");
        onClose();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col px-4 gap-y-2 pb-3 bg-slate-200 w-full h-full ">
        <div className="flex flex-row p-3 gap-3 text-2xl font-bold items-center">
          <BiCalendarPlus className="text-cyan-600" />
          <h1 className="">Registrar Nueva Actividad</h1>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-4 bg-white p-4 border rounded-lg justify-between">
              <div className="flex flex-col gap-2 w-1/3">
                <label className="text-lg font-bold">
                  Selectionar la actividad
                </label>
                <Select
                  multiple
                  size={6}
                  onChange={(e) => handleSelectActividad(e.target.value)}
                >
                  {tipoActividades.map((tipo, index) => (
                    <option key={tipo.id_tipoActividad} value={index}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Select>
                <TextInput
                  icon={MdSearch}
                  name="search"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Actividad..."
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-lg font-bold">
                  Datos de la actividad
                </label>
                <div className="flex flex-row">
                  <div className="flex flex-col w-full px-2">
                    <div>
                      <big>
                        <b>Nombre</b>
                      </big>
                      <TextInput
                        ref={focusNombreRef}
                        readOnly={!edit}
                        icon={""}
                        name="nombre"
                        id="nombre"
                        value={actividad?.nombre}
                        onChange={(e) =>
                          setActividad({ ...actividad, nombre: e.target.value })
                        }
                        placeholder="Nombre de la actividad..."
                      />
                    </div>
                    <div>
                      <big>
                        <b>Descripcion</b>
                      </big>
                      <Textarea
                        ref={focusDescripcionRef}
                        readOnly={!edit}
                        rows={4}
                        icon={""}
                        name="descripcion"
                        id="descripcion"
                        value={actividad?.descripcion}
                        onChange={(e) =>
                          setActividad({
                            ...actividad,
                            descripcion: e.target.value,
                          })
                        }
                        placeholder="Descripción de la actividad..."
                      />
                    </div>
                  </div>
                  <div className="flex flex-col border-l px-2 gap-1 justify-end">
                    <Tooltip content="Agregar" placement="left">
                      <button
                        disabled={edit}
                        onClick={handleAdd}
                        className={`border-2 border-gray-400 rounded-md flex flex-row ${
                          edit ? "text-gray-400 bg-white" : "bg-blue-200"
                        }`}
                      >
                        <BiCalendarPlus size={"1.7rem"} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Editar" placement="left">
                      <button
                        disabled={
                          actividad.id_tipoActividad !== null && !edit
                            ? false
                            : true
                        }
                        className={`border-2  border-gray-400 rounded-md  ${
                          actividad.id_tipoActividad !== null && !edit
                            ? "bg-blue-200"
                            : "text-gray-400 bg-white"
                        }`}
                        onClick={handleEdit}
                      >
                        <BiEditAlt size={"1.7rem"} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Guardar" placement="left">
                      <button
                        disabled={!edit}
                        className={`border-2  border-gray-400 rounded-md ${
                          edit ? "bg-blue-200" : "text-gray-400 bg-white"
                        }`}
                        onClick={handleSave}
                      >
                        <BiSave size={"1.7rem"} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Cancelar" placement="left">
                      <button
                        disabled={!edit}
                        className={`border-2  border-gray-400 rounded-md ${
                          edit ? "bg-blue-200" : "text-gray-400 bg-white"
                        }`}
                        onClick={handleCancel}
                      >
                        <BiTrash size={"1.7rem"} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            {/* 
            //  
            // area de informacion de la actividad          
            // 
            */}
            <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
              <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-bold">Grados</h1>
                <div className="flex flex-row gap-1">
                  <big>
                    <b></b>
                  </big>
                  <Tooltip content="Grado de la actividad" ref={focusGradoRef}>
                    <Select
                      name="id_grado"
                      onChange={(e) => handleChange(e)}
                      ref={focusGradoRef}
                    >
                      <option value={0}></option>
                      {grados
                        .filter((grado) =>
                          !actividadGrados.some(
                            (ag) => ag.id_grado === grado.id_grado
                          )
                            ? grado
                            : null
                        )
                        .map((grado) => (
                          <option key={grado.id_grado} value={grado.id_grado}>
                            {grado.nombre}
                          </option>
                        ))}
                    </Select>
                  </Tooltip>
                  <Tooltip content="Fecha de la actividad" ref={focusFechaRef}>
                    <TextInput
                      ref={focusFechaRef}
                      type="date"
                      name="fecha"
                      value={defaultActividad.fecha}
                      onChange={(e) => handleChange(e)}
                    />
                  </Tooltip>
                  <Tooltip content="Monto de la actividad" ref={focusMontoRef}>
                    <TextInput
                      ref={focusMontoRef}
                      type="number"
                      name="monto"
                      value={defaultActividad.monto}
                      onChange={(e) => handleChange(e)}
                    />
                  </Tooltip>
                  <Button
                    disabled={
                      actividad.id_tipoActividad && !edit ? false : true
                    }
                    color={"dark"}
                    onClick={handleAddGrado}
                  >
                    Agregar Grado
                  </Button>
                </div>
              </div>
              {/* 
            //  
            // area de grados     
            // 
            */}
              <div>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Nro.</Table.HeadCell>
                    <Table.HeadCell>Grado</Table.HeadCell>
                    <Table.HeadCell>Fecha</Table.HeadCell>
                    <Table.HeadCell>Monto</Table.HeadCell>
                    <Table.HeadCell>Acciones</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {actividadGrados.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>
                          {grados.map((g) =>
                            g.id_grado === item.id_grado ? g.nombre : null
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {DateFormatter(new Date(item.fecha))}
                        </Table.Cell>
                        <Table.Cell>{CurrencyFormatter(item.monto)}</Table.Cell>
                        <Table.Cell className="flex justify-end">
                          <Tooltip placement="top" content="Quitar">
                            <HiOutlineTrash
                              className="cursor-pointer"
                              color="red"
                              size={"1.4rem"}
                              onClick={() => handleRemoveItem(index)}
                            />
                          </Tooltip>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    <Table.Row>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
              <div className="flex justify-end p-2 gap-4">
                <Button
                  color="dark"
                  disabled={actividadGrados.length == 0 ? true : false}
                  onClick={handleSubmit}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NuevaActividad;
