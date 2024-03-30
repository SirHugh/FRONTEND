import { useState } from "react";
import { createResponsables } from "../services/AcademicoService";

function NewResponsable() {
  const [FormData, setFormData] = useState({
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
    setFormData({ ...FormData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    async function submitData() {
      const res = await createResponsables(FormData);
      console.log(res.data);
    }
    submitData();

    // Add logic to submit the form data to a server or perform other actions
  };

  return (
    <div>
      <form className="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cedula">Cedula de Identidad:</label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={FormData.cedula || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="ruc">Ruc:</label>
          <input
            type="text"
            id="ruc"
            name="ruc"
            value={FormData.ruc || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nombre">Nombre/s:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={FormData.nombre || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="apellido">Apellido/s:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={FormData.apellido || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="telefono">Telefono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={FormData.telefono || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={FormData.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="direccion">Direccion:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={FormData.direccion || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default NewResponsable;
