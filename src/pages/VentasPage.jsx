import { FaUsersCog } from "react-icons/fa";
import TablaVentas from "../components/Ventas/TablaVentas";
import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import NuevaVenta from "../components/Ventas/NuevaVenta";
import { TbShoppingCartCancel, TbShoppingCartPlus } from "react-icons/tb";

function VentasPage() {
  const [ShowAgregar, setShowAgregar] = useState(false);

  return (
    <>
      <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
        <FaUsersCog className="text-cyan-600" />
        <h1 className="">Ventas</h1>
      </div>
      <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
        <div>
          <Button
            className="flex flex-wrap bg-blue-500"
            onClick={() =>
              ShowAgregar ? setShowAgregar(false) : setShowAgregar(true)
            }
          >
            {ShowAgregar ? (
              <>
                <TbShoppingCartCancel className="mr-2 h-5 w-5" />
                <h1>Cancelar</h1>
              </>
            ) : (
              <>
                <TbShoppingCartPlus className="mr-2 h-5 w-5" />
                <h1>Nueva Venta</h1>
              </>
            )}
          </Button>
        </div>
      </div>
      {ShowAgregar ? (
        <NuevaVenta onClose={() => setShowAgregar(false)} />
      ) : (
        <TablaVentas />
      )}
    </>
  );
}

export default VentasPage;
