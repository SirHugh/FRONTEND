import { Avatar, Card, Tooltip } from "flowbite-react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { MdEditSquare, MdPassword } from "react-icons/md";
import { useState } from "react";

function UserCard({ user, groups, editUser, activateUser, resetPassKey }) {
  const userGroups = groups.filter((group) => user.groups.includes(group.id));

  return (
    <>
      <Card className={`p-0 w-full ${!user.is_active ? "bg-slate-200" : ""}`}>
        <div className="flex flex-row gap-2 justify-between text-gray-500">
          <div className="flex">
            <div className="flex items-center w-36 justify-center">
              <Avatar img={user.foto} size="lg" alt="" rounded />
            </div>
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
                <p className="user-card__cedula">
                  <b>Cedula: </b>
                  {user.cedula}
                </p>
                <p className="user-card__phone">
                  <b>Telefono: </b>
                  {user.telefono}
                </p>
                <p className="user-card__address">
                  <b>Direccion: </b>
                  {user.direccion}
                </p>
              </div>
              <div className="flex flex-col w-52">
                <p className="user-card__last-login">
                  <b>Ultimo login: </b>{" "}
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "Nunca"}
                </p>
                <p
                  className={`${
                    !user.is_active ? " text-red-800" : " text-green-800"
                  }`}
                >
                  <b>Estado: </b>
                  {user.is_active ? "Activo" : "Desactivado"}
                </p>
              </div>
              <p className="user-card__groups">
                <b>Molulos: </b>
                {userGroups.map((group) => group.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center gap-3 text-black">
            <Tooltip content="Editar" placement="top">
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
              placement="top"
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
              placement="top"
            >
              <button
                disabled={user.is_active ? false : true}
                className="w-8 h-8 items-center bg-transparent"
                onClick={() => resetPassKey()}
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
