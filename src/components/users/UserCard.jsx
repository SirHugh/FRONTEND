import { Button, Card } from "flowbite-react";
import { FcDeleteDatabase } from "react-icons/fc";
import { MdDelete, MdEditSquare } from "react-icons/md";

function UserCard({ user, groups }) {
  const userGroups = groups.filter((group) => user.groups.includes(group.id));

  return (
    <>
      <Card className=" w-full ">
        <div className="flex flex-row gap-3 justify-between text-gray-500">
          <div className="flex  ">
            <div className="flex flex-col ">
              <h2 className="mb-1 text-xl font-medium text-gray-900 dark:text-white w-72 ">
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
                <p className="user-card__is-active">
                  Es Activo: {user.is_active ? "Si" : "No"}
                </p>
              </div>
              <p className="user-card__groups">
                Grupo: {userGroups.map((group) => group.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-black">
            <Button className="w-8 h-8 items-center bg-transparent">
              <MdEditSquare color="black" fontSize="2.1rem" />
            </Button>
            <Button className="w-8 h-8 items-center bg-transparent">
              <MdDelete color="black" fontSize="2.1rem" />
            </Button>
            <Button className="w-8 h-8 items-center bg-transparent">
              <FcDeleteDatabase color="black" fontSize="2.1rem" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default UserCard;
