import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { MdSearch, MdTableChart } from "react-icons/md";
import TablaFlujoCaja from "../components/FlujoCaja/TablaFlujoCaja";
import { FaBackward, FaCashRegister } from "react-icons/fa";
import FlujoCaja from "../components/FlujoCaja/FlujoCaja";
import { useParams } from "react-router-dom";
import moment from "moment";

function FlujoCajaPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");
  const id = useParams();

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <FaCashRegister className="text-blue-500" />
        <h1 className="">Flujo De Caja</h1>
      </div>
      <div className="flex flex-row justify-between h-20 px-6 gap-3 border items-center">
        <div>
          {ShowAgregar ? (
            <></>
          ) : (
            // <TextInput
            //   type="date"
            //   icon={MdSearch}
            //   name="search"
            //   id="search"
            //   value={search}
            //   onChange={(e) => {
            //     setSearch(
            //       moment(new Date(e.target.value)).format("YYYY-MM-DD")
            //     );
            //     console.log(
            //       moment(new Date(e.target.value)).format("YYYY-MM-DD")
            //     );
            //   }}
            // />
            ""
          )}
        </div>
        <Button
          className="flex flex-wrap bg-blue-500"
          onClick={() =>
            ShowAgregar ? setShowAgregar(false) : setShowAgregar(true)
          }
        >
          {ShowAgregar ? (
            <>
              <FaBackward className="mr-2 h-5 w-5" />
              <h1>Volver</h1>
            </>
          ) : (
            <>
              <MdTableChart className="mr-2 h-5 w-5" />
              <h1>Historico</h1>
            </>
          )}
        </Button>
      </div>
      {ShowAgregar ? (
        <TablaFlujoCaja search={search} />
      ) : (
        <FlujoCaja
          id_flujoCaja={id || ""}
          onClose={() => setShowAgregar(false)}
        />
      )}
    </>
  );
}

export default FlujoCajaPage;
