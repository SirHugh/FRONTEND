import { useState } from "react";
import { Button, TextInput, Select, Spinner } from "flowbite-react";
import { BiArchiveOut } from "react-icons/bi";

import { getProducto } from "../services/CajaService";
import { FaHistory, FaPrint } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  MdOutlineInventory,
  MdOutlineInventory2,
  MdSearch,
} from "react-icons/md";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import AjusteInventario from "../components/Inventario/AjusteInventario";
import TablaInventario from "../components/Inventario/TablaInventario";
import ControlStockList from "../components/Inventario/ControlStockList";
import { initiateStockControl } from "../services/ComercialService";
import ConfirmationModal from "../components/ConfirmationModal";

function InventarioPage() {
  const [search, setSearch] = useState("");
  const [esActivo, setEsActivo] = useState(false);
  const [showAjuste, setShowAjuste] = useState(false);
  const [showInventario, setShowIventario] = useState(true);
  const [showControlStock, setShowControlStock] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cantidadProductos, setCantidadProductso] = useState(0);
  const [filtroProductos, setFiltroProductos] = useState([]);

  const retrivePoductos = () => {
    getProducto("", "PR", "", search, esActivo)
      .then((res) => {
        setFiltroProductos(res.data);
        setCantidadProductso(res.data.length);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error al obtener los productos:", error);
        return;
      });
  };

  const handleExportRows = async () => {
    setShowConfirmModal(false);

    //Inicia un nuevo Control de Stock
    let newStockControl;
    try {
      const res = await initiateStockControl(search, esActivo);
      newStockControl = res.data;
      toast.success("Nuevo control de stock Iniciado");
    } catch (error) {
      toast.error(error.message);
      return;
    }

    const doc = new jsPDF();
    doc.text("Control de Inventario", doc.internal.pageSize.width / 2, 10, {
      align: "center",
    });

    //Informacion Control Stock
    doc.setFontSize(10);
    doc.text(`Nro. Control: ${newStockControl.id_controlStock}`, 15, 20);
    doc.text(`Fecha: ${newStockControl.fecha}`, 15, 25);
    doc.text(`Usuario: ${newStockControl.usuario}`, 15, 30);
    doc.text(
      `Estado: ${newStockControl.es_activo ? "Abierto" : "Cerrado"}`,
      15,
      35
    );
    doc.text(`Cant. Productos: ${newStockControl.cantidad_productos}`, 15, 40);

    autoTable(doc, {
      startY: 50,
      head: [["Codigo", "Nombre", "Stock encontrado"]],
      body: filtroProductos.map((producto) => {
        return [producto.id_producto, producto.nombre, ""];
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
    setFiltroProductos([]);
  };

  const handleShow = (setShow) => {
    setShowAjuste(false);
    setShowControlStock(false);
    setShowIventario(false);
    setShow(true);
  };

  const handleConfirm = () => {
    retrivePoductos();
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setFiltroProductos([]);
    setCantidadProductso(0);
  };

  return (
    <>
      <ConfirmationModal
        show={showConfirmModal}
        title="Iniciar Control de Inventario"
        onConfirm={handleExportRows}
        onCancel={handleCancel}
        message={"¿Confima iniciar un nuevo control de inventario?"}
      >
        <div className="flex flex-col pt-3 gap-3">
          <p>{cantidadProductos} articulos agregados</p>
          <small className="text-red-700">Esta acción es irreversible.</small>
        </div>
      </ConfirmationModal>
      <div className="flex flex-col">
        <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
          <MdOutlineInventory2 className="text-blue-500" />
          <h1 className="">Inventario</h1>
        </div>
        <div className="flex flex-row justify-between h-28 p-3 gap-3 items-center drop-shadow-lg">
          <div className="flex flex-row gap-3 w-1/2">
            {/* {showAjuste ? ( */}
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
              {!showAjuste && (
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
            {/* ) : (
              ""
            )} */}
          </div>
          <div className="flex flex-row gap-3 w-1/2">
            <Button.Group outline>
              <Button color="gray" onClick={() => handleShow(setShowIventario)}>
                <MdOutlineInventory2 className="mr-2 h-5 w-5" />
                <span className="ml-2">Inventario</span>
              </Button>
              <Button
                disabled={!showInventario}
                color="gray"
                // className="flex flex-wrap bg-blue-500"
                onClick={handleConfirm}
              >
                <FaPrint className="mr-2 h-5 w-5" />
                <h1>Nuevo Control</h1>
              </Button>
              <Button
                color="gray"
                // className="flex flex-wrap bg-blue-500"
                onClick={() => handleShow(setShowControlStock)}
              >
                <MdOutlineInventory className="mr-2 h-5 w-5" />
                <h1>Contoles</h1>
              </Button>
              <Button color="gray" onClick={() => handleShow(setShowAjuste)}>
                <>
                  <BiArchiveOut className="mr-2 h-5 w-5" />
                  <h1>Baja</h1>
                </>
              </Button>
            </Button.Group>
          </div>
        </div>
        <div className="flex">
          {showAjuste && <AjusteInventario search={search} />}

          {showInventario && (
            <TablaInventario search={search} esActivo={esActivo} />
          )}

          {showControlStock && <ControlStockList search={search} />}
        </div>
      </div>
    </>
  );
}

export default InventarioPage;
