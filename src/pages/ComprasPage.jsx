import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { MdAddBusiness, MdBusiness, MdSearch, MdStore } from "react-icons/md";
import { BiBlock, BiCart, BiCartAdd } from "react-icons/bi";
import NuevaCompra from "../components/Compras/NuevaCompra";
import TablaCompras from "../components/Compras/TablaCompras";

function ComprasPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <MdStore className="text-blue-500" />
        <h1 className="">Compras</h1>
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
              <MdAddBusiness className="mr-2 h-5 w-5" />
              <h1>Nueva Compra</h1>
            </>
          )}
        </Button>
      </div>
      {ShowAgregar ? (
        <NuevaCompra onClose={() => setShowAgregar(false)} />
      ) : (
        <TablaCompras search={search} />
      )}
    </>
  );
}

export default ComprasPage;
