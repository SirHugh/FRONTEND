import { useState } from "react";
import AgregarTimbradoModal from "../components/Timbrado/AgregarTimbradoModal";
import { Button } from "flowbite-react";
import { LiaFileInvoiceSolid } from "react-icons/lia";

import { FaPlus } from "react-icons/fa";

function TimbradoPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timbrado, setTimbrado] = useState();

  return (
    <>
      <AgregarTimbradoModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        timbrado={timbrado}
      />
      <div>
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <LiaFileInvoiceSolid className="text-blue-700" />
          <h1 className="">TIMBRADOS</h1>
        </div>
        <div className="flex flex-row justify-end h-16 p-3 gap-3 border items-center">
          <div>
            <Button
              className="flex flex-wrap bg-blue-500 "
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2 h-5 w-5" />
              <h1>Nuevo Timbrado</h1>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TimbradoPage;
