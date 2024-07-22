import { Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { getCliente } from "../../services/CajaService";
import toast from "react-hot-toast";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import AsyncSelect from "react-select/async";

const Cliente = ({ cliente, setCliente, edit }) => {
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);
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

  const loadOptions = async () => {
    if (inputValue.length < 2) return;
    return getCliente("", inputValue, 1).then((result) => {
      const res = result.data.results;
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = async (value) => {
    setSelecteValue(value);
    setCliente(value);
    setForm(value);
    console.log("Cliente: ", value);
  };

  const handleChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <p className="font-bold text-2xl self-center">Datos del Cliente</p>
        <div className="flex flex-row items-center gap-3 justify-end">
          <div className="flex flex-col w-72 text-md ">
            <AsyncSelect
              noOptionsMessage={() => "No se encuentran resultados"}
              placeholder="Buscar Cliente..."
              cacheOptions
              defaultOptions
              value={selectedValue}
              loadOptions={loadOptions}
              onInputChange={handleInputChange}
              onChange={handleChange}
              getOptionLabel={(e) => e.nombre + " " + e.apellido}
              getOptionValue={(e) => e.id_cliente}
            />
          </div>
          <FaRegPlusSquare size={25} className="cursor-pointer" />
          <FaRegEdit size={25} className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col pt-4">
        <span>
          <b>RUC: </b>
          {form?.ruc ? form?.ruc : form?.cedula}
        </span>
        <span>
          <b>Nombre o Razon Social: </b>
          {form?.nombre + " " + form?.apellido}
        </span>
        <span>
          <b>Dirección: </b>
          {form?.direccion}
        </span>
      </div>
      {edit && (
        <div className="grid grid-cols-3 gap-4 w-full ">
          <Label>
            Cedula:
            <TextInput
              type="text"
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
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
        </div>
      )}
    </>
  );
};

export default Cliente;
