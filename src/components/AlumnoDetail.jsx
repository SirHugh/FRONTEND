import { useState, useEffect, useRef } from "react";
import {
  getAlumnoById,
  getMatriculasAlumnoId,
  getResponsables,
  updateAlumno,
} from "../services/AcademicoService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Breadcrumb, Label } from "flowbite-react";
import nophoto from "../assets/no-photo.png";
import { CiCamera } from "react-icons/ci";

const AlumnoDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [alumno, setAlumno] = useState(null);
  const [responsable, setResponsable] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const imageRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await getAlumnoById(id);
        setAlumno(response.data);
        const res2 = await getResponsables(id);
        setResponsable(res2.data);
        const res3 = await getMatriculasAlumnoId("", id);
        setMatriculas(res3.data);
        console.log(res3.data);
      } catch (error) {
        console.error("Error fetching alumno details:", error);
      }
    };
    fetchAlumno();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno({
      ...alumno,
      [name]: value,
    });
  };

  const handelImageChange = () => {
    const file = imageRef.current.files[0];
    setAlumno((prevState) => ({
      ...prevState,
      fotocarnet: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const alumnoFormData = new FormData();
      for (var key in alumno) {
        if (key === "fotocarnet") {
          alumno[key] instanceof File
            ? alumnoFormData.append(key, alumno[key])
            : "";
        } else alumnoFormData.append(key, alumno[key] ? alumno[key] : "");
      }

      await updateAlumno(alumno.id_alumno, alumnoFormData);
      toast.success("Información del alumno guardada.");
    } catch (error) {
      console.error("Error updating alumno:", error);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col px-10 py-10">
      <Breadcrumb>
        <Breadcrumb.Item>Academico</Breadcrumb.Item>
        <Breadcrumb.Item>Alumno</Breadcrumb.Item>
        <Breadcrumb.Item>Ficha</Breadcrumb.Item>
      </Breadcrumb>
      <div className="border rounded-3xl mt-5 shadow-lg w-3/4">
        {alumno ? (
          <div className="flex flex-col rounded-lg">
            <div className="flex items-center rounded-t-lg w-full h-16 bg-blue-400 text-lg font-bold px-10">
              <big>Ficha del Alumno</big>
            </div>
            <div className="bg-white-100 p-4 rounded-md ">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* left column */}
                <div className="col-span-1 md:col-span-1">
                  <div className="flex relative drop-shadow-2">
                    {alumno.fotocarnet ? (
                      <img
                        src={
                          alumno.fotocarnet instanceof File
                            ? URL.createObjectURL(alumno.fotocarnet)
                            : alumno.fotocarnet
                        }
                        alt="profile"
                        className="avatar rounded-full border-4 border-white mx-auto object-cover"
                      />
                    ) : (
                      <img src={nophoto} alt="upload image" />
                    )}
                    <label
                      htmlFor="foto"
                      className={`absolute p-1 bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2 ${
                        isEditing
                          ? "cursor-pointer bg-blue-800"
                          : "bg-slate-300"
                      }`}
                    >
                      <CiCamera size="2rem" />
                      <input
                        disabled={!isEditing}
                        ref={imageRef}
                        type="file"
                        name="foto"
                        id="foto"
                        className="sr-only"
                        onChange={handelImageChange}
                      />
                    </label>
                  </div>
                </div>

                {/* edit form column */}
                <div className="col-span-1 md:col-span-2">
                  <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.nombre}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          required
                        />
                        <label
                          htmlFor="nombre"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Nombre
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="apellido"
                          id="apellido"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.apellido}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          required
                        />
                        <label
                          htmlFor="apellido"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Apellido
                        </label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="cedula"
                          id="cedula"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.cedula}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          required
                        />
                        <label
                          htmlFor="cedula"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus
                  :-translate-y-6"
                        >
                          Cédula
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="genero"
                          id="genero"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={
                            alumno.genero == "F" ? "Femenino" : "Masculino"
                          }
                          onChange={handleChange}
                          readOnly={true}
                          required
                        />
                        <label
                          htmlFor="genero"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Género
                        </label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="fecha_nac"
                          id="fecha_nac"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.fecha_nac}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          required
                        />
                        <label
                          htmlFor="fecha_nac"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Fecha de Nacimiento
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="nacionalidad"
                          id="nacionalidad"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.nacionalidad}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="nacionalidad"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Nacionalidad
                        </label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="barrio"
                          id="barrio"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.barrio}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="barrio"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Barrio
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="direccion"
                          id="direccion"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.direccion}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="direccion"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Dirección
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="edad_primer_grado"
                          id="edad_primer_grado"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.edad_primer_grado}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="edad_primer_grado"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Edad al Ingresar al Primer Grado
                        </label>
                      </div>
                      {/* Perfil Psicologico */}
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="perfil_psicologico"
                          id="perfil_psicologico"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.perfil_psicologico}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="perfil_psicologico"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Perfil Psicológico
                        </label>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 md:gap-6">
                      {/* Alergico a */}
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="alergico_a"
                          id="alergico_a"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.alergico_a}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="alergico_a"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Alergico a
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="cantidad_hermanos"
                          id="cantidad_hermanos"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.cantidad_hermanos}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="cantidad_hermanos"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Cantidad de Hermanos
                        </label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-5 group">
                        <input
                          type="text"
                          name="telefono"
                          id="telefono"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          value={alumno.telefono}
                          onChange={handleChange}
                          readOnly={!isEditing}
                        />
                        <label
                          htmlFor="telefono"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Teléfono
                        </label>
                      </div>
                    </div>
                    {isEditing ? (
                      <div className="flex justify-between mt-4">
                        <button
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={handleEdit}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleEdit}
                      >
                        Actualizar Informacion
                      </button>
                    )}
                  </form>
                </div>
              </div>
              <hr className="my-4" />
              <div className="flex justify-end mt-4">
                {/* Otros campos de entrada */}
              </div>
            </div>
          </div>
        ) : (
          <p>Cargando datos del alumno...</p>
        )}
      </div>
      <div className="border rounded-3xl mt-5 shadow-lg w-3/4">
        <div className="flex items-center rounded-t-lg w-full h-14 bg-blue-400 text-lg font-bold px-10">
          <big>Responsable/s del Alumno</big>
        </div>
        <div className="bg-white-100 rounded-md ">
          {responsable.map((resposable) => (
            <div
              key={responsable.id_cliente}
              className="grid grid-cols-3 items-center justify-start gap-y-3 px-4 py-5 gap-x-7 border-t-4"
            >
              <Label>
                Nombre:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.nombre}
                </b>
              </Label>

              <Label>
                Apellidos:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.apellido}
                </b>
              </Label>

              <Label>
                Afiliación:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.tipo_relacion}
                </b>
              </Label>

              <Label>
                Cedula:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.cedula}
                </b>
              </Label>

              <Label>
                Telefono:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.telefono}
                </b>
              </Label>

              <Label>
                E-mail:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.email}
                </b>
              </Label>

              <Label>
                Dirección:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.id_cliente.direccion}
                </b>
              </Label>

              <Label>
                Ocupación:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {resposable.ocupacion || "NN"}
                </b>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-3xl mt-5 shadow-lg w-3/4">
        <div className="flex items-center rounded-t-lg w-full h-14 bg-blue-400 text-lg font-bold px-10">
          <big>Matriculaciones</big>
        </div>
        <div className="bg-white-100 rounded-md ">
          {matriculas.map((matricula) => (
            <div
              key={matricula.id_matricula}
              className="grid grid-cols-3 items-center justify-start gap-y-3 px-4 py-5 gap-x-7 border-t-4"
            >
              <Label>
                Periodo:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {matricula.anio_lectivo}
                </b>
              </Label>

              <Label>
                Grado/Curso:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {matricula.id_grado.nombre}
                </b>
              </Label>

              <Label>
                Turno:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {matricula.id_grado.turno}
                </b>
              </Label>

              <Label>
                Estado:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {matricula.es_activo ? "Activo" : "Inactivo"}
                </b>
              </Label>

              <Label>
                Origen:
                <b className="flex text-lg font-bold border-b-2 w-52">
                  {matricula.es_interno ? "Fundacion UPC" : "Externo"}
                </b>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumnoDetail;
