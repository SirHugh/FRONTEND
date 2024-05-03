import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { createUser } from "../../services/AuthService";
import toast, { Toaster } from "react-hot-toast";

const NewUserModal = ({ show, onClose, groups }) => {
  const [formValues, setFormValues] = useState({
    user: {
      nombre: "",
      apellido: "",
      cedula: "",
      direccion: "",
      telefono: "",
      email: "",
      password: "",
      is_staff: false,
      is_active: false,
      is_superuser: false,
    },
    group: { id: "" },
  });

  //   const history = useHistory();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevFormValues) => {
      return {
        ...prevFormValues,
        user: {
          ...prevFormValues.user,
          [name]: type === "checkbox" ? checked : value,
        },
      };
    });
  };
  const handleGroupChange = (e) => {
    const { value } = e.target;
    setFormValues((prevFormValues) => {
      return {
        ...prevFormValues,
        group: {
          ...prevFormValues.group,
          ["id"]: value,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your code here to send the form data to the server
    // For example, using the fetch API
    try {
      const response = await createUser(formValues);
      console.log(response);
    } catch (error) {
      toast(error.massage, { duration: 5000 });
    }
    console.log(formValues);
    // if (response.ok) {
    //   history.push("/users");
    // }
  };

  return (
    <>
      <Toaster />
      <Modal show={show} onClose={onClose} size="lg">
        <Modal.Header>Nuevo Usuario</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="email">
                Email:
              </Label>
              <TextInput
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="password">
                Contraseña:
              </Label>
              <TextInput
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="nombre">
                Nombre:
              </Label>
              <TextInput
                type="text"
                name="nombre"
                value={formValues.nombre}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="apellido">
                Apellido:
              </Label>
              <TextInput
                type="text"
                name="apellido"
                value={formValues.apellido}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="cedula">
                Cedula:
              </Label>
              <TextInput
                type="number"
                name="cedula"
                value={formValues.cedula}
                onChange={handleChange}
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="direccion">
                Direccion:
              </Label>
              <TextInput
                type="text"
                name="direccion"
                value={formValues.direccion}
                onChange={handleChange}
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="telefono">
                Telefono:
              </Label>
              <TextInput
                type="tel"
                name="telefono"
                value={formValues.telefono}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="group">
                Grupo:
              </Label>
              <Select
                name="group"
                value={formValues.group.id}
                onChange={handleGroupChange}
                required
                multiple
                className="w-4/5"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="is_active">
                Es Activo:
              </Label>
              <Checkbox
                type="checkbox"
                name="is_active"
                checked={formValues.is_active}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add User</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewUserModal;
