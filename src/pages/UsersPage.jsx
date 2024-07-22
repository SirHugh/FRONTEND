import { useEffect, useState } from "react";
import { getGroups, getUser } from "../services/AuthService";
import toast, { Toaster } from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { FaPlus, FaUsersCog } from "react-icons/fa";
import { Button } from "flowbite-react";
import UserCard from "../components/users/UserCard";
import NewUserModal from "../components/users/NewUserModal";
import ActivateUserModal from "../components/users/ActivateUserModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showActivateUserModal, setShowActivateUserModal] = useState(false);
  const initialState = {
    id: "",
    last_login: "",
    email: "",
    nombre: "",
    apellido: "",
    cedula: 0,
    direccion: "",
    telefono: "",
    is_staff: true,
    is_active: false,
    groups: [],
    user_permissions: [],
  };
  const [user, setUser] = useState(initialState);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const retriveUser = async () => {
      try {
        const res = await getUser();
        console.log(res.data);
        const res2 = await getGroups();
        setUsers(res.data);
        setGroups(res2.data);
      } catch (error) {
        toast(error.massage, {
          duration: 5000,
          icon: <BiError color="red" fontSize="5.5rem" />,
        });
      }
    };
    retriveUser();
  }, [reload]);

  const handdleEdit = (u) => {
    setUser(u);
    setShowNewUserModal(true);
  };

  const handdleActivate = (u) => {
    setUser(u);
    setShowActivateUserModal(true);
  };

  const onCloseModal = () => {
    setUser(initialState);
    if (showNewUserModal) {
      setShowNewUserModal(false);
    }
    if (showActivateUserModal) {
      setShowActivateUserModal(false);
    }
  };

  return (
    <>
      <NewUserModal
        show={showNewUserModal}
        user={user}
        setUser={setUser}
        onClose={onCloseModal}
        groups={groups}
        reload={reload}
        setReload={setReload}
      />
      <ActivateUserModal
        show={showActivateUserModal}
        onClose={onCloseModal}
        user={user}
        reload={reload}
        setReload={setReload}
      />
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <FaUsersCog className="text-cyan-600" />
          <h1 className="">Usuarios</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap bg-blue-500"
              onClick={() => setShowNewUserModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Agregar Usuario</h1>
            </Button>
          </div>
        </div>
        <div>
          <div className="px-10  bg-gray-300 ">
            {users.map((u) => (
              <div key={u.id}>
                <UserCard
                  user={u}
                  groups={groups}
                  editUser={() => handdleEdit(u)}
                  activateUser={() => handdleActivate(u)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersPage;
