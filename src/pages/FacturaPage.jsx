import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { BiBlock } from "react-icons/bi";

import TablaFacturas from "../components/Factura/TablaFacturas";
import NuevaFactura from "../components/Factura/NuevaFactura";
import { GrTableAdd } from "react-icons/gr";
import { getFlujoCajaCurrent } from "../services/CajaService";
import toast from "react-hot-toast";
import { FaFileInvoice } from "react-icons/fa";

function FacturaPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");

  const handleAgregarFractura = async () => {
    try {
      await getFlujoCajaCurrent();
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
      return;
    }
    setShowAgregar(!ShowAgregar);
  };

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <FaFileInvoice className="text-blue-500" />
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
          onClick={handleAgregarFractura}
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
