import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tooltip,
  TextInput,
  Select,
  ButtonGroup,
} from "flowbite-react";
import { BiAdjust, BiBlock } from "react-icons/bi";
import PaginationButtons from "../components/PaginationButtons";
import { getProducto } from "../services/CajaService";
import { FaHistory, FaPrint } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdOutlineInventory, MdSearch } from "react-icons/md";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import AjusteInventario from "../components/Inventario/AjusteInventario";
import TablaInventario from "../components/Inventario/TablaInventario";

function InventarioPage() {
  const [search, setSearch] = useState("");
  const [esActivo, setEsActivo] = useState(false);
  const [showAjuste, setShowAjuste] = useState(false);

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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
          <MdOutlineInventory className="text-blue-500" />
          <h1 className="">Inventario</h1>
        </div>
        <div className="flex flex-row justify-between h-16 p-3 gap-3 items-center">
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
                <Select
                  className="w-1/5"
                  onChange={(e) => setEsActivo(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value={true}>Activos</option>
                  <option value={false}>Inactivos</option>
                </Select>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-row gap-2">
            <Button.Group outline>
              <Button color="gray">
                <MdOutlineInventory className="mr-2 h-5 w-5" />
                <span className="ml-2">Inventario</span>
              </Button>
              <Button
                color="gray"
                onClick={() =>
                  showAjuste ? setShowAjuste(false) : setShowAjuste(true)
                }
              >
                <>
                  <BiAdjust className="mr-2 h-5 w-5" />
                  <h1>Ajustes</h1>
                </>
              </Button>
              <Button
                disabled={showAjuste}
                color="gray"
                // className="flex flex-wrap bg-blue-500"
                onClick={() => {}}
              >
                <FaHistory className="mr-2 h-5 w-5" />
                <h1>Historico</h1>
              </Button>
              <Button
                disabled={showAjuste}
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
          {showAjuste ? (
            <AjusteInventario />
          ) : (
            <TablaInventario search={search} esActivo={esActivo} />
          )}
        </div>
      </div>
    </>
  );
}

export default InventarioPage;
