import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DetalleFactura from "./DetalleFactura";
import Encabezado from "./Encabezado";
import {
  createComprobante,
  getActiveTimbrado,
} from "../../services/CajaService";
import { getBasicInfo } from "../../services/BasicsService";
import { CurrencyFormatter } from "../Constants";
import { Button } from "flowbite-react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { BiError } from "react-icons/bi";
import SummaryModal from "./SummaryModal";
import Cliente from "./Cliente";
import AddItemModal from "./AddItemModal";
import { GrTableAdd } from "react-icons/gr";

function NuevaFactura({ onClose }) {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [detalleList, setDetalleList] = useState({
    aranceles: [],
    ventas: [],
  });
  const [timbrado, setTimbrado] = useState();
  const [info, setInfo] = useState();
  const [factura, setFactura] = useState({
    comprobante: {
      id_comprobante: "",
      id_timbrado: "",
      nro_factura: "",
      id_user: user.user_id,
      id_cliente: "",
      fecha: moment(new Date()).format("YYYY-MM-DD"),
      tipo_pago: "C",
      monto: 0,
    },
    aranceles: [],
    pagoventas: [],
    actividades: [],
  });

  useEffect(() => {
    const fetchBasics = async () => {
      try {
        const res = await getActiveTimbrado();
        if (res.data[0]) {
          setTimbrado(res.data[0]);
          setFactura({
            ...factura,
            comprobante: {
              ...factura.comprobante,
              ["nro_factura"]: res.data[0].ultimo_numero + 1,
              ["id_timbrado"]: res.data[0].id_timbrado,
            },
          });
        } else
          toast.error("No se encontro timbrado habilitado", {
            duration: 5000,
            icon: <BiError color="red" fontSize="1.5rem" />,
          });
        const res2 = await getBasicInfo();
        setInfo(res2.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBasics();
  }, []);

  useEffect(() => {
    let total = detalleList.aranceles?.reduce(
      (total, item) => total + Number(item.monto),
      0
    );

    total =
      total +
      detalleList.ventas?.reduce(
        (total, item) => total + Number(item.monto),
        0
      );

    let aux_aranceles = [];
    detalleList.aranceles.forEach((detalle) => {
      aux_aranceles.push(detalle.id_arancel);
    });

    let aux_ventas = [];
    detalleList.ventas.forEach((venta) => {
      aux_ventas.push(venta.id_pago);
    });

    setFactura({
      ...factura,
      comprobante: { ...factura.comprobante, ["monto"]: total },
      aranceles: aux_aranceles,
      pagoventas: aux_ventas,
    });

    console.log(factura);
    console.log("detalle", detalleList);
  }, [detalleList]);

  const onSetCliente = (cliente) => {
    console.log("cliente", cliente);
    setFactura({
      ...factura,
      comprobante: {
        ...factura.comprobante,
        ["id_cliente"]: cliente.id_cliente,
      },
    });
  };

  const onSetData = (detalle) => {
    const filteredAranceles = detalle.aranceles.filter(
      (arancel) =>
        !detalleList.aranceles.some((d) => d.id_arancel == arancel.id_arancel)
    );
    const filteredVentas = detalle.ventas.filter(
      (venta) => !detalleList.ventas.some((d) => d.id_pago == venta.id_pago)
    );
    setDetalleList({
      ...detalleList,
      aranceles: [...detalleList.aranceles, ...filteredAranceles],
      ventas: [...detalleList.ventas, ...filteredVentas],
    });
  };

  const validate = () => {
    if (factura.comprobante.id_cliente === "") {
      toast.error("Debe seleccionar un cliente");
      return false;
    }
    if (factura.comprobante.monto === 0) {
      toast.error("Debe seleccionar al menos un concepto de pago");
      return false;
    }
    if (factura.comprobante.id_timbrado === "") {
      toast.error("Debe habilitar un timbrado");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    if (!window.confirm("Confirmar la generación de la factura?")) {
      toast.error("Operacion Cancelada");
      return;
    }
    console.log("data", factura);
    try {
      await createComprobante(factura);
      toast.success("Factura creada exitosamente!", { duration: 5000 });
    } catch (error) {
      toast.error(error.message, {
        duration: 5000,
        icon: <BiError color="red" fontSize="5.5rem" />,
      });
      console.error("Error al crear la factura:", error);
    }
    setShowSummaryModal(true);
  };

  const onCloseSummary = () => {
    setShowSummaryModal(false);
    onClose();
  };

  return (
    <>
      <SummaryModal
        show={showSummaryModal}
        onClose={() => onCloseSummary()}
        comprobante={factura.comprobante}
        detalleList={detalleList}
      />
      <AddItemModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        setData={(detalle) => onSetData(detalle)}
        action={() => {}}
        cliente={factura.comprobante.id_cliente}
      />
      <div className="flex flex-col px-4 gap-y-2 pb-3 bg-slate-200 w-full h-full ">
        <div className="flex flex-row p-3 gap-3 text-2xl font-bold items-center">
          <GrTableAdd className="text-blue-500" />
          <h1 className="">Registro de Factura</h1>
        </div>
        {/* encabezado de la factura */}
        <div className="flex flex-col bg-white p-4 border rounded-lg">
          <Encabezado timbrado={timbrado} info={info} />
        </div>

        {/* datos del cliente */}
        <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
          <div className="flex flex-row justify-between">
            <p className="font-bold text-2xl self-center">Datos del Cliente</p>
            <div className="flex flex-row items-center p-2 gap-2 text-3xl justify-end">
              <FaRegPlusSquare className="cursor-pointer" />
              <FaRegEdit className="cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full ">
            <Cliente setCliente={(cliente) => onSetCliente(cliente)} />
          </div>
        </div>

        {/* detalle de la factura */}
        <div className="flex flex-col gap-4 bg-white p-4 border rounded-lg divide-y">
          <div className="flex flex-row justify-between items-end">
            <p className="font-bold text-2xl">Detalle de la Factura</p>
            <div className="flex w-14 items-center gap-2 text-3xl justify-end">
              <FaRegPlusSquare
                className="cursor-pointer"
                onClick={() => setShowAddModal(true)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className=" w-full ">
              <DetalleFactura items={detalleList} setItems={setDetalleList} />
            </div>
          </div>
        </div>
        {/* pie de la factura */}
        <div className="flex flex-col bg-white p-4 border rounded-lg">
          <div className="flex flex-row justify-end p-5 gap-3">
            <p className="flex font-bold w-52">TOTAL</p>
            <p>{CurrencyFormatter(factura.comprobante.monto)} gs.</p>
          </div>
        </div>
        <div className="flex justify-end p-2 gap-4">
          <Button onClick={handleSubmit}>Guardar</Button>
        </div>
      </div>
    </>
  );
}

export default NuevaFactura;
{
  onclose;
}
