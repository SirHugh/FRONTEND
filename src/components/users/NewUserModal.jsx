import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { createUser, updateUser } from "../../services/AuthService";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaUserPlus,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const NewUserModal = ({
  show,
  onClose,
  groups,
  user,
  setUser,
  reload,
  setReload,
}) => {
  const [remover, setRemover] = useState(null);
  const [agregar, setAgregar] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const gr = groups.filter((group) => user.groups.includes(group.id));
    setUserGroups(gr);
  }, [show, update]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevFormValues) => {
      return {
        ...prevFormValues,
        [name]: type === "checkbox" ? checked : value,
      };
    });
    console.log(user);
  };

  const agregarGrupo = () => {
    if (user.groups.includes(agregar)) {
      console.log("incluye", agregar);

      return;
    }
    setUpdate(!update);
    setUser((prevFormValues) => {
      return {
        ...prevFormValues,
        groups: [...prevFormValues.groups, agregar],
      };
    });
  };

  const removerGrupo = () => {
    const ng = user.groups.filter((group) => group !== remover);
    console.log("remover:", ng);
    setUser((prevFormValues) => {
      return {
        ...prevFormValues,
        groups: [...ng],
      };
    });
    setUpdate(!update);
  };

  const OnClose = () => {
    setAgregar(null);
    setRemover(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { groups, user_permissions, ...newUser } = user;
    const gr = user.groups;
    const data = { user: newUser, groups: gr };

    // Add your code here to send the form data to the server
    // For example, using the fetch API
    if (newUser.id) {
      try {
        const response = await updateUser(newUser.id, data);
        console.log(response);
        toast.success("Usuario actualizado correctamente", { duration: 5000 });
        onClose();
        setReload(!reload);
        return;
      } catch (error) {
        console.log(error);
        toast.error("Error al actualizar los datos.", { duration: 5000 });
      }
    }
    try {
      const response = await createUser(data);
      toast.success("Usuario creado correctamente", { duration: 5000 });
      onClose();
      setReload(!reload);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast("Error al guardar los datos.", { duration: 5000 });
    }
  };

  return (
    <>
      <Modal show={show} onClose={OnClose} size="lg">
        <Modal.Header>
          <div className="flex flex-row items-center gap-3">
            <FaUserPlus />
            Usuario
          </div>
        </Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="nombre">
                Nombre:
              </Label>
              <TextInput
                type="text"
                name="nombre"
                value={user.nombre}
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
                value={user.apellido}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="email">
                Email:
              </Label>
              <TextInput
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                className="w-4/5"
              />
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="password">
                Clave de acceso:
              </Label>
              <TextInput
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required={user.id ? false : true}
                className="w-4/5"
              />
            </div>

            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="group">
                Grupos:
              </Label>
              <Select
                name="groups"
                // value={user.groups}
                onChange={(e) => {
                  setAgregar(parseFloat(e.target.value));
                }}
                // required
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
            <div className="flex flex-row gap-4 items-center justify-center">
              <div
                className={` ${
                  agregar ? "hover:cursor-pointer text-black" : "text-gray-500"
                }`}
                onClick={() => (agregar ? agregarGrupo() : "")}
              >
                <FaArrowAltCircleDown size="1.2rem" />
              </div>
              <div
                className={` ${
                  remover ? "hover:cursor-pointer text-black" : "text-gray-500"
                }`}
                onClick={() => (remover ? removerGrupo() : "")}
              >
                <FaArrowAltCircleUp />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="group"></Label>
              <Select
                name="groups"
                onChange={(e) => {
                  setRemover(parseFloat(e.target.value));
                  console.log(remover);
                }}
                multiple
                className="w-4/5"
              >
                {userGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
            </div>
            {/* <div className="flex flex-row gap-4 items-center">
              <Label className="w-1/5" htmlFor="is_active">
                Es Activo:
              </Label>
              <Checkbox
                type="checkbox"
                name="is_active"
                checked={user.is_active}
                onChange={handleChange}
              />
            </div> */}
            <div className="flex justify-end">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewUserModal;
