import { useState } from "react";

function ResponsableCard({ change }) {
  const [responsablesData, setResponsablesData] = useState({
    cedula: "",
    ruc: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    tipo: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setResponsablesData({ ...responsablesData, [name]: value });
  };

  const handleSubmit = () => {
    change(responsablesData);
  };

  return (
    <div className="w-full p-2">
      <form
        className="w-full p-2 gap-2 border border-cyan-600 rounded-md"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className=" grid grid-flow-col items-end gap-6 mb-6 md:grid-cols-3">
          <div className="relative mt-3">
            <input
              title="Documento de Identidad Civil"
              type="number"
              id="cedula"
              name="cedula"
              onChange={handleChange}
              className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
              placeholder=""
              required
            />
            <label
              htmlFor="cedula"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Cedula
            </label>
          </div>

          <div className="relative mt-3">
            <input
              pattern="[0-9]{8}-[1-9]{1}"
              type="text"
              title="Ruc"
              id="Ruc"
              name="Ruc"
              onChange={handleChange}
              className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
              placeholder=""
            />
            <label
              htmlFor="Ruc"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Ruc
            </label>
          </div>
          <div className="relative mt-3">
            <input
              pattern="[0-9]{4}-[0-9]{6}"
              type="text"
              title="Ej: 0981-111555"
              id="telefono"
              name="telefono"
              onChange={handleChange}
              className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
              placeholder=""
              required
            />
            <label
              htmlFor="telefono"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Telefono
            </label>
          </div>
        </div>
        <div className="relative mt-3">
          <input
            type="text"
            id="nombre"
            name="nombre"
            onChange={handleChange}
            className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
            placeholder=""
            required
          />
          <label
            htmlFor="nombre"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Nombre/s
          </label>
        </div>
        <div className="relative mt-3">
          <input
            type="text"
            id="apellido"
            name="apellido"
            onChange={handleChange}
            className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
            placeholder=""
          />
          <label
            htmlFor="apellido"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Apellido/s
          </label>
        </div>
        <div className="relative mt-3">
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
            placeholder=""
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Correo electrónico
          </label>
        </div>
        <div className="relative mt-3">
          <input
            type="text"
            id="direccion"
            name="direccion"
            onChange={handleChange}
            className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
            placeholder=""
          />
          <label
            htmlFor="direccion"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Direccion
          </label>
        </div>

        <div className=" grid grid-flow-col items-end gap-6 mb-6 md:grid-cols-3">
          <div className="relative mt-3">
            <input
              type="text"
              id="ocupacion"
              name="ocupacion"
              onChange={handleChange}
              className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
              placeholder=""
            />
            <label
              htmlFor="ocupacion"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Ocupación
            </label>
          </div>

          <div className="relative mt-3">
            <input
              title="Padre, Madre, Tio/a, Responsable Legal, etc"
              type="text"
              id="relacion"
              name="relacion"
              onChange={handleChange}
              className="block h-8 py-4 px-2.5 pb-2.5 pt-4 w-full text-sm peer border border-black placeholder:text-transparent rounded-md"
              placeholder=""
            />
            <label
              htmlFor="relacion"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:placeholder:text-slate-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Parentezco / Relacion
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-slate-600 py-2 px-5 text-white"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}

export default ResponsableCard;
