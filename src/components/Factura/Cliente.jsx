import { Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { getCliente } from "../../services/CajaService";
import toast from "react-hot-toast";

const Cliente = ({ cliente, edit }) => {
  const [lclEdit, setLclEdit] = useState(edit || true);
  const [form, setForm] = useState(
    cliente || {
      cedula: "",
      ruc: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      direccion: "",
      tipo: "",
    }
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handdleSearch = async () => {
    if (!form.cedula) {
      console.log("no hay cedula");
      return;
    }
    try {
      const res = await getCliente(form.cedula);
      if (!res.data[0]) {
        toast.error("Sin Cliente con el nro. ci");
        return;
      }
      setForm(res.data[0]);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Label>
        Cedula:
        <TextInput
          type="text"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          onBlur={handdleSearch}
          autoFocus
        />
      </Label>
      <Label>
        RUC:
        <TextInput
          type="text"
          name="ruc"
          value={form.ruc}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Nombre:
        <TextInput
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Apellido:
        <TextInput
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Teléfono:
        <TextInput
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Email:
        <TextInput
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Dirección:
        <TextInput
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          readOnly={lclEdit}
        />
      </Label>
      <Label>
        Tipo:
        <Select
          name={"Tipo"}
          value={form.tipo}
          onChange={handleChange}
          className=""
          readOnly={lclEdit}
        >
          <option value=""></option>
          <option value="F">Fisico</option>
          <option value="J">Juridico</option>
        </Select>
      </Label>
    </>
  );
};

export default Cliente;
