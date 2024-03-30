import { useEffect, useState, useRef } from "react";
import { createAlumno, getAlumnoById } from "../services/AcademicoService";
import { useParams } from "react-router-dom";
import MyImage from "../assets/photo-upload.png";
import ResponableCard from "../components/ResponsableCard";

export default function NewStudent() {
  const input_classname =
    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer";

  const label_classname =
    "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6";

  const [studentData, setStudentData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    genero: "",
    fecha_nac: "",
    telefono: "",
    nacionalidad: "",
    direccion: "",
    barrio: "",
    alergico_a: "",
    edad_primer_grado: "",
    curso_jardin: "",
    perfil_psicologico: "",
    cantidad_hermanos: "",
    fotocarnet: "",
  });

  const [responsablesData, setResponsablesData] = useState([]);

  const { id_alumno } = useParams();
  const [isOpened, setIsOpened] = useState(false);

  function toggle() {
    setIsOpened((isOpen) => !isOpen);
  }

  useEffect(() => {
    async function loadAlumno() {
      const res = await getAlumnoById(id_alumno);
      console.log(res);
      setStudentData(res.data);
    }
    if (id_alumno) {
      loadAlumno();
    }
  }, []);

  const loadResponsable = (responsable) => {
    setResponsablesData([...responsablesData, responsable]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setStudentData({ ...studentData, [event.target.name]: file });
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    async function CreateAlumno() {
      const res = await createAlumno(formData);
      console.log(res.data);
    }
    CreateAlumno();

    // Add logic to submit the form data to a server or perform other actions
  };

  return (
    <div>
      <form className="relative py-4" onSubmit={handleSubmit}>
        <div className="w-full grid grid-flow-row-dense grid-cols-3 gap-2 p-3">
          <div className="p-2 h-4/5 flex justify-center items-center">
            <div className="">
              <label htmlFor="fotocarnet" className="image-upload-label">
                Foto Carnet
              </label>
              <div onClick={handleClick} style={{ cursor: "pointer" }}>
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="upload image"
                    className="img-display-after"
                  />
                ) : (
                  <img
                    src={studentData.fotocarnet || MyImage}
                    alt="upload image"
                    className="img-display-after"
                  />
                )}

                <input
                  id="fotocarnet"
                  name="fotocarnet"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-3">
            <div className="gap-3 grid grid-cols-2">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="cedula"
                  id="cedula"
                  autoComplete="off"
                  className={input_classname}
                  value={studentData.cedula}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="cedula" className={label_classname}>
                  N° de Cedula de Identidad
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <label
                  htmlFor="genero"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sexo
                </label>
                <select
                  required
                  id="genero"
                  name="genero"
                  value={studentData.genero}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option></option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                className={input_classname}
                type="text"
                id="nombre"
                name="nombre"
                autoComplete="off"
                value={studentData.nombre}
                onChange={handleChange}
                placeholder=""
                required
              />
              <label htmlFor="nombre" className={label_classname}>
                Nombre/s
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                className={input_classname}
                type="text"
                id="apellido"
                name="apellido"
                autoComplete="off"
                value={studentData.apellido}
                onChange={handleChange}
                placeholder=""
                required
              />
              <label className={label_classname} htmlFor="apellido">
                Apellido/s
              </label>
            </div>
          </div>
        </div>

        <br />
        <label htmlFor="fecha_nac">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="fecha_nac"
          name="fecha_nac"
          autoComplete="off"
          value={studentData.fecha_nac}
          onChange={handleChange}
        />
        <div className="relative z-0 w-full mb-5 group">
          <span className="absolute start-0 bottom-3 text-gray-500 dark:text-gray-400">
            <svg
              className="w-4 h-4 rtl:rotate-[270deg]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 19 18"
            >
              <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
            </svg>
          </span>
          <input
            className={input_classname + " ps-6 pe-0 "}
            pattern="[0-9]{4}-[0-9]{6}"
            type="text"
            id="telefono"
            name="telefono"
            autoComplete="off"
            value={studentData.telefono}
            onChange={handleChange}
            placeholder=""
          />
          <label
            htmlFor="telefono: ej. 0976-222333"
            className={label_classname + " ps-6 pe-0"}
          >
            Telefono: ej. 0976-222333
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            className={input_classname}
            type="text"
            id="nacionalidad"
            name="nacionalidad"
            value={studentData.nacionalidad}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="nacionalidad" className={label_classname}>
            Nacionalidad:
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            className={input_classname}
            type="text"
            id="direccion"
            name="direccion"
            value={studentData.direccion}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="direccion" className={label_classname}>
            Direccion:
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            className={input_classname}
            type="text"
            id="barrio"
            name="barrio"
            value={studentData.barrio}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="barrio" className={label_classname}>
            Barrio:
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            className={input_classname}
            type="text"
            id="alergico_a"
            name="alergico_a"
            value={studentData.alergico_a}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="alergico_a" className={label_classname}>
            Alergico a:
          </label>
        </div>
        <br />
        <label htmlFor="edad_primer_grado">Edad en Primer Grado:</label>
        <input
          type="number"
          id="edad_primer_grado"
          name="edad_primer_grado"
          value={studentData.edad_primer_grado}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="curso_jardin">Curso de Jardin:</label>
        <input
          type="text"
          id="curso_jardin"
          name="curso_jardin"
          value={studentData.curso_jardin}
          onChange={handleChange}
        />
        <div className="relative z-0 w-full h-20 mb-5 group">
          <textarea
            className={input_classname}
            type="text"
            id="perfil_psicologico"
            name="perfil_psicologico"
            value={studentData.perfil_psicologico}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="perfil_psicologico" className={label_classname}>
            Perfil Psicologico:
          </label>
        </div>
        <br />
        <div className="relative z-0 w-full h-20 mb-5 group">
          <label htmlFor="cantidad_hermanos">Cantidad de Hermanos:</label>
          <input
            type="number"
            id="cantidad_hermanos"
            name="cantidad_hermanos"
            value={studentData.cantidad_hermanos}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2 items-center border-black border-2 rounded-md">
          <div className="p-2 flex flex-row w-full bg-slate-300 justify-between">
            <h1>Responsables</h1>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {(isOpened && "Quitar") || "Agregar"}
            </button>
          </div>
          {isOpened && <ResponableCard change={loadResponsable} />}
          <div>
            {responsablesData.map((responsable) => (
              <h1 key={responsable.cedula}> {responsable.nombre}</h1>
            ))}
            {console.log(responsablesData)}
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
