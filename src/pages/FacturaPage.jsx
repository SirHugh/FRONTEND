import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { BiBlock, BiCartAdd } from "react-icons/bi";

import TablaFacturas from "../components/Factura/TablaFacturas";
import NuevaFactura from "../components/Factura/NuevaFactura";
import { FaCashRegister } from "react-icons/fa6";
import { GrTableAdd } from "react-icons/gr";

function FacturaPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <FaCashRegister className="text-blue-500" />
        <h1 className="">Facturación</h1>
      </div>
      <div className="flex flex-row justify-between h-20 px-6 gap-3 border items-center">
        <div>
          {!ShowAgregar ? (
            <TextInput
              icon={MdSearch}
              name="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre. Apellido. CI."
            />
          ) : (
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
              <BiBlock className="mr-2 h-5 w-5" />
              <h1>Cancelar</h1>
            </>
          ) : (
            <>
              <GrTableAdd className="mr-2 h-5 w-5" />
              <h1>Nueva Factura</h1>
            </>
          )}
        </Button>
      </div>
      {ShowAgregar ? (
        <NuevaFactura onClose={() => setShowAgregar(false)} />
      ) : (
        <TablaFacturas search={search} />
      )}
    </>
  );
}

export default FacturaPage;
