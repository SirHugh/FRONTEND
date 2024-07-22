import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getUserData, updateUser, validatePassword } from "../services/AuthService";
import { FaUserEdit } from "react-icons/fa";
import { Button, Label, TextInput } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: ""
  });

  useEffect(() => {
    if (user?.user_id) {
      getUserData(user.user_id)
        .then(response => {
          setUserData(response.data);
          setEditedUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleUpdate = async (updatedData) => {
    if (user?.user_id) {
      try {
        const response = await validatePassword({ password: editedUser.password });
        console.log("Respuesta del back sobre password: "+JSON.stringify(response.data.detail ));
        if (response.data.detail === 'Password is valid') {
          const updateResponse = await updateUser(user.user_id, updatedData);
          setUserData(updateResponse.data);
          setIsEditing(false);
          toast.success("Usuario actualizado correctamente", { duration: 5000 });
        } else {
          toast.error("Contraseña incorrecta", { duration: 5000 });
        }
      } catch (error) {
        toast.error("Error al validar la contraseña.", { duration: 5000 });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(editedUser);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h1 className="text-primary flex items-center gap-2">
        <FaUserEdit />
        Datos del Usuario
      </h1>
      <hr className="my-4" />
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <TextInput
              type="text"
              name="nombre"
              id="nombre"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={editedUser.nombre}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
            <Label
              htmlFor="nombre"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nombre
            </Label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <TextInput
              type="text"
              name="apellido"
              id="apellido"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={editedUser.apellido}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
            <Label
              htmlFor="apellido"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Apellido
            </Label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <TextInput
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={editedUser.email}
              onChange={handleChange}
              readOnly={!isEditing}
              required
            />
            <Label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </Label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <TextInput
              type="text"
              name="telefono"
              id="telefono"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={editedUser.telefono}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <Label
              htmlFor="telefono"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Telefono
            </Label>
          </div>
        </div>
        {isEditing && (
          <div className="relative z-0 w-full mb-5 group">
            <TextInput
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={editedUser.password}
              onChange={handleChange}
              required
            />
            <Label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Contraseña Actual
            </Label>
          </div>
        )}
        <div className="flex justify-between items-center">
          <Button type="button" onClick={handleEdit}>
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && <Button type="submit">Guardar Cambios</Button>}
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default UserProfilePage;
