import { useState, useEffect } from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { BiAdjust } from "react-icons/bi";
import { getProducto } from "../services/CajaService";
import { FaHistory, FaPrint } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdOutlineInventory, MdSearch } from "react-icons/md";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import AjusteInventario from "../components/Inventario/AjusteInventario";
import TablaInventario from "../components/Inventario/TablaInventario";
import HistoricoAjuste from "../components/Inventario/HistoricoAjuste";

function InventarioPage() {
  const [search, setSearch] = useState("");
  const [esActivo, setEsActivo] = useState(false);
  const [showAjuste, setShowAjuste] = useState(false);
  const [showInventario, setShowIventario] = useState(true);
  const [showHistorial, setShowHistorial] = useState(false);

  const handleExportRows = async () => {
    var prods = [];
    try {
      const res = await getProducto("", "PR", "", search, esActivo);
      for (let index = 0; index < 20; index++) {
        prods = [...prods, ...res.data];
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error al obtener los productos:", error);
      return;
    }

    const doc = new jsPDF();

    doc.text("Inventario", doc.internal.pageSize.width / 2, 10, {
      align: "center",
    });

    autoTable(doc, {
      head: [
        ["Codigo", "Nombre", "Stock Actual", "Stock encontrado", "Diferencia"],
      ],
      body: prods.map((producto) => {
        return [
          producto.id_producto,
          producto.nombre,
          producto.stock,
          "",
          "",
          "",
        ];
      }),
    });
    const pageCount = doc.internal.getNumberOfPages();

    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        "Pagina " + String(i) + " de " + String(pageCount),
        doc.internal.pageSize.width / 2,
        287,
        {
          align: "center",
        }
      );
    }
    doc.save(`inventario-${new Date().toLocaleString()}.pdf`);
  };

  const handleShowActivate = async (producto) => {};

  const handleSave = async (producto) => {};

  const handleShow = (setShow) => {
    setShowAjuste(false);
    setShowHistorial(false);
    setShowIventario(false);
    setShow(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
          <MdOutlineInventory className="text-blue-500" />
          <h1 className="">Inventario</h1>
        </div>
        <div className="flex flex-row justify-between h-28 p-3 gap-3 items-center drop-shadow-lg">
          <div className="flex flex-row gap-3 w-1/2">
            {!showAjuste ? (
              <>
                <TextInput
                  className="w-2/5"
                  icon={MdSearch}
                  name="search"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Producto..."
                />
                {!showHistorial && (
                  <Select
                    className="w-1/5"
                    onChange={(e) => setEsActivo(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value={true}>Activos</option>
                    <option value={false}>Inactivos</option>
                  </Select>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-row gap-3 w-1/2">
            <Button.Group outline>
              <Button color="gray" onClick={() => handleShow(setShowIventario)}>
                <MdOutlineInventory className="mr-2 h-5 w-5" />
                <span className="ml-2">Inventario</span>
              </Button>
              <Button color="gray" onClick={() => handleShow(setShowAjuste)}>
                <>
                  <BiAdjust className="mr-2 h-5 w-5" />
                  <h1>Ajustes</h1>
                </>
              </Button>
              <Button
                color="gray"
                // className="flex flex-wrap bg-blue-500"
                onClick={() => handleShow(setShowHistorial)}
              >
                <FaHistory className="mr-2 h-5 w-5" />
                <h1>Historico</h1>
              </Button>
              <Button
                disabled={!showInventario}
                color="gray"
                // className="flex flex-wrap bg-blue-500"
                onClick={handleExportRows}
              >
                <FaPrint className="mr-2 h-5 w-5" />
                <h1>Imprimir lista</h1>
              </Button>
            </Button.Group>
          </div>
        </div>
        <div className="flex justify-center">
          {showAjuste && <AjusteInventario />}

          {showInventario && (
            <TablaInventario search={search} esActivo={esActivo} />
          )}

          {showHistorial && <HistoricoAjuste search={search} />}
        </div>
      </div>
    </>
  );
}

export default InventarioPage;
