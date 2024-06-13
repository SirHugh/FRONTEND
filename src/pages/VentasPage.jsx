import TablaVentas from "../components/Ventas/TablaVentas";
import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import NuevaVenta from "../components/Ventas/NuevaVenta";
import { MdSearch } from "react-icons/md";
import { BiBlock, BiCart, BiCartAdd } from "react-icons/bi";

function VentasPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <BiCart className="text-cyan-600" />
        <h1 className="">Ventas</h1>
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
              <BiCartAdd className="mr-2 h-5 w-5" />
              <h1>Nueva Venta</h1>
            </>
          )}
        </Button>
      </div>
      {ShowAgregar ? (
        <NuevaVenta onClose={() => setShowAgregar(false)} />
      ) : (
        <TablaVentas search={search} />
      )}
    </>
  );
}

export default VentasPage;
