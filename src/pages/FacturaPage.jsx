import {
  FaAccessibleIcon,
  FaAddressBook,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { HiXCircle } from "react-icons/hi";
import Cliente from "../components/Factura/Cliente";
import toast from "react-hot-toast";
import AddItemModal from "../components/Factura/AddItemModal";
import { useState } from "react";

function FacturaPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <AddItemModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <div className="flex flex-col px-8 gap-y-2 bg-blue-100 w-full h-full ">
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <FaFileInvoiceDollar className="text-cyan-600" />
          <h1 className="">Registro de Factura</h1>
        </div>
        {/* encabezado de la factura */}
        <div className="flex flex-col bg-white p-4 border rounded-lg">
          Encabezado
        </div>
        {/* datos del cliente */}
        <div className="flex flex-col gap-4 bg-white p-4 border rounded-lg">
          <div className="border-b-2">Datos del Cliente</div>
          <div className="flex flex-row gap-4">
            <div className="grid grid-cols-3 gap-4 w-full ">
              <Cliente />
            </div>
            <div className="flex flex-col border-l-2 w-14 items-center gap-2 text-3xl">
              <FaFileInvoiceDollar />
              <FaAddressBook />
              <FaAccessibleIcon />
            </div>
          </div>
        </div>
        {/* detalle de la factura */}
        <div className="flex flex-col gap-4 bg-white p-4 border rounded-lg">
          <div>Detalle de la Factura</div>
          <div className="flex flex-row gap-4">
            <div className="grid grid-cols-3 gap-4 w-full ">
              tabla de detalle
            </div>
            <div className="flex flex-col border-l-2 w-14 items-center gap-2 text-3xl">
              <MdLibraryAdd
                className="cursor-pointer"
                onClick={() => setShowAddModal(true)}
              />
              <HiXCircle color="red" />
            </div>
          </div>
        </div>
        {/* pie de la factura */}
        <div className="flex flex-col bg-white p-4 border rounded-lg">Pie</div>
      </div>
    </>
  );
}

export default FacturaPage;
