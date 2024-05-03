import { useEffect, useState } from "react";
import { getGroups, getUser } from "../services/AuthService";
import toast, { Toaster } from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { FaPlus, FaUsersCog } from "react-icons/fa";
import { Button } from "flowbite-react";
import UserCard from "../components/users/UserCard";
import NewUserModal from "../components/users/NewUserModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  useEffect(() => {
    const retriveUser = async () => {
      try {
        const res = await getUser();
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
  }, []);

  return (
    <>
      <Toaster />
      <NewUserModal
        show={showNewUserModal}
        onClose={() => setShowNewUserModal(false)}
        groups={groups}
      />
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <FaUsersCog className="text-cyan-600" />
          <h1 className="">Usuarios</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap"
              onClick={() => setShowNewUserModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Agregar Usuario</h1>
            </Button>
          </div>
        </div>
        <div>
          <div className="px-10  bg-gray-300 ">
            {users.map((user) => (
              <div key={user.id}>
                <UserCard user={user} groups={groups} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersPage;
