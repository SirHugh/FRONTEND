// import DefaultLayout from "../layout/DefaultLayout";
import CoverOne from "../assets/cover-1.jpg";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getUserData,
  updateUser,
  updateUserPassword,
  updateUserPhoto,
} from "../services/AuthService";
import useAuth from "../hooks/useAuth";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { CiCamera } from "react-icons/ci";
import nophoto from "../assets/no-photo.png";
import { Button, Spinner, Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import { BiEdit, BiSave } from "react-icons/bi";

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });
  const imageRef = useRef(null);
  const [passwordChange, setPasswordChange] = useState(null);
  const [infoChanged, setInfoChanged] = useState(false);
  const old_passwordRef = useRef(null);
  const new_passwordRef = useRef(null);
  const confirm_passwordRef = useRef(null);

  useEffect(() => {
    if (user?.user_id) {
      getUserData(user.user_id)
        .then((response) => {
          setUserData(response.data);
          setUserInfo({
            nombre: response.data.nombre,
            apellido: response.data.apellido,
            email: response.data.email,
          });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  const handleChange = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setInfoChanged(true);
  };

  const handelImageChange = () => {
    const file = imageRef.current.files[0];
    setUserData((prevState) => ({
      ...prevState,
      foto: file,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordChange((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSave = async () => {
    if (!edit) {
      setEdit(true);
      inputRef.current.focus();
      return;
    }
    onSave();
  };

  const validatePassword = () => {
    if (!passwordChange.old_password) {
      toast.error("Debe ingresar la contraseña actual");
      old_passwordRef.current.focus();
      return;
    }
    if (
      !passwordChange.new_password ||
      passwordChange.new_password.length < 6
    ) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      new_passwordRef.current.focus();
      return false;
    }
    if (passwordChange.new_password !== passwordChange.confirm_password) {
      toast.error("Las contraseñas no coinciden");
      confirm_passwordRef.current.focus();
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (passwordChange) {
      if (!validatePassword()) return;
      try {
        console.log(passwordChange);
        const res = await updateUserPassword(userData.id, passwordChange);
        console.log(res.data);
        toast.success("Contraseña actualizada");
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
        return;
      }
    }

    setEdit(false);
    const { foto, user_permissions, groups, ...rest } = userData;

    if (infoChanged) {
      try {
        await updateUser(userData.id, {
          user: rest,
          groups: groups,
        });
        toast.success("Información Actualizada");
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }
    if (foto instanceof File) {
      try {
        const fotoFormData = new FormData();
        fotoFormData.append("foto", foto);
        await updateUserPhoto(userData.id, fotoFormData);
        toast.success("Foto de perfil actualizada");
      } catch (error) {
        toast.error(error.message);
        return;
      }
    }
  };
  return (
    <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb className="p-3">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Perfil</Breadcrumb.Item>
      </Breadcrumb>
      {loading && <div>Cargando...</div>}
      {!loading && (
        <>
          <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-36 md:h-64">
              <img
                src={CoverOne}
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
            </div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-12">
              <div className="flex relative z-30 mx-auto -mt-24 h-30 w-full max-w-30 rounded-full bg-transparent bg-slate-300 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                <div className="flex relative drop-shadow-2">
                  {userData.foto ? (
                    <img
                      src={
                        userData.foto instanceof File
                          ? URL.createObjectURL(userData.foto)
                          : userData.foto
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
                      edit ? "cursor-pointer bg-blue-800" : "bg-slate-300"
                    }`}
                  >
                    <CiCamera size="2rem" />
                    <input
                      disabled={!edit}
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
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  {userInfo.nombre} {userInfo.apellido}
                </h3>
                <p className="font-medium">{userInfo.email}</p>
                <div className="flex mt-2 gap-2 justify-center">
                  <Tooltip
                    content={`${edit ? "Guardar" : "Actualizar"}`}
                    placement="left"
                  >
                    <Button
                      color="dark"
                      className="p-0 text-white"
                      onClick={handleEditSave}
                    >
                      {edit ? <BiSave size={20} /> : <BiEdit size={20} />}
                    </Button>
                  </Tooltip>
                </div>
                <div className="mt-4">
                  <big>Informacion personal</big>
                </div>
                <div className="grid grid-cols-3 mt-5">
                  <div className="flex flex-col justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        ref={inputRef}
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.nombre}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="genero"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Nombre/s
                      </label>
                    </div>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="apellido"
                        id="apellido"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.apellido}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="apellido"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Apellidos
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="cedula"
                        id="cedula"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.cedula}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="cedula"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Cedula
                      </label>
                    </div>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="telefono"
                        id="telefono"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.telefono}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="telefono"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Telefono
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        type="text"
                        name="direccion"
                        id="direccion"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.direccion}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="direccion"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Direccion
                      </label>
                    </div>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={userData.email}
                        onChange={handleChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="email"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        E-mail
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center w-full ">
                  <div className="flex flex-col w-1/3 items-center justify-center gap-1 px-4 xsm:flex-row">
                    <big>Seguridad</big>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        ref={old_passwordRef}
                        type="password"
                        name="old_password"
                        id="old_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={passwordChange?.old_password}
                        onChange={handlePasswordChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="old_password"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Contraseña actual
                      </label>
                    </div>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        ref={new_passwordRef}
                        type="password"
                        name="new_password"
                        id="new_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={passwordChange?.new_password}
                        onChange={handlePasswordChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="new_password"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Nueva Contraseña
                      </label>
                    </div>
                    <div className="flex relative z-0 w-full mb-5 group">
                      <input
                        ref={confirm_passwordRef}
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={passwordChange?.confirm_password}
                        onChange={handlePasswordChange}
                        readOnly={!edit}
                        autoComplete="off"
                      />
                      <label
                        htmlFor="confirm_password"
                        className="absolute peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Confirmar Contraseña
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6.5"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
