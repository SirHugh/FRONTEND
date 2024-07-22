import { Card, Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { MdEditSquare, MdPassword } from "react-icons/md";
import ConfirmationModal from "../ConfirmationModal";
import { useEffect, useState } from "react";
import { resetUserPasskey } from "../../services/AuthService";

function UserCard({ user, groups, editUser, activateUser }) {
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const userGroups = groups.filter((group) => user.groups.includes(group.id));

  const resetPassKey = async () => {
    setShow(false);
    try {
      await resetUserPasskey(user.id);
      toast.success("Clave cambiada y enviada");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ConfirmationModal
        show={show}
        title="Cambiar Clave"
        message="Desea generar una nueva clave de acceso para el usuario?"
        onConfirm={() => resetPassKey()}
        onCancel={() => setShow(false)}
      >
        <div className="flex flex-col gap-2 mt-3">
          <p>
            <b>Usuario: </b>
            {user.nombre}
          </p>
          <p>
            La nueva clave sera enviada al correo <b>{user.email}</b>
          </p>
        </div>
      </ConfirmationModal>

      <Card className={` w-full ${!user.is_active ? "bg-slate-200" : ""}`}>
        <div className="flex flex-row gap-3 justify-between text-gray-500">
          <div className="flex  ">
            <div className="flex flex-col ">
              <h2
                className={`mb-1 text-xl font-medium dark:text-white w-72 ${
                  !user.is_active ? " text-red-500" : " text-gray-900"
                }`}
              >
                {user.nombre} {user.apellido}
              </h2>
              <p className="">{user.email}</p>
              <p className="user-card__id">ID: {user.id}</p>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-col w-52">
                <p className="user-card__cedula">Cedula: {user.cedula}</p>
                <p className="user-card__phone">Telefono: {user.telefono}</p>
                <p className="user-card__address">
                  Direccion: {user.direccion}
                </p>
              </div>
              <div className="flex flex-col w-52">
                <p className="user-card__last-login">
                  Ultimo login:{" "}
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "Nunca"}
                </p>
                <p
                  className={`${
                    !user.is_active ? " text-red-800" : " text-gray-900"
                  }`}
                >
                  Es Activo: {user.is_active ? "Si" : "No"}
                </p>
              </div>
              <p className="user-card__groups">
                Grupo: {userGroups.map((group) => group.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-black">
            <Tooltip content="Editar" placement="left">
              <button
                className="w-8 h-8 items-center bg-transparent"
                onClick={() => {
                  editUser();
                }}
              >
                <MdEditSquare
                  className=" text-blue-500 size-8"
                  fontSize="2.1rem"
                />
              </button>
            </Tooltip>
            <Tooltip
              content={user.is_active ? "Desactivar" : "Activar"}
              placement="left"
            >
              <button
                className="w-8 h-8 items-center bg-transparent"
                onClick={() => {
                  activateUser();
                }}
              >
                {user.is_active ? (
                  <FaToggleOn
                    title="DESACTIVAR"
                    className="size-8 text-blue-500 "
                  />
                ) : (
                  <FaToggleOff
                    title="ACTIVAR"
                    className="size-8 text-red-800"
                  />
                )}
              </button>
            </Tooltip>
            <Tooltip
              hidden={user.is_active ? false : true}
              content="Cambiar Clave"
              placement="left"
            >
              <button
                disabled={user.is_active ? false : true}
                className="w-8 h-8 items-center bg-transparent"
                onClick={() => setShow(true)}
              >
                <MdPassword
                  className={`size-8 ${
                    user.is_active ? "text-blue-500" : "text-slate-400"
                  }`}
                />
              </button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </>
  );
}

export default UserCard;
