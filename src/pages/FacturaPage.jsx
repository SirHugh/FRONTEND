import {
  FaFileInvoiceDollar,
  FaRegEdit,
  FaRegPlusSquare,
} from "react-icons/fa";
import Cliente from "../components/Factura/Cliente";
import toast from "react-hot-toast";
import AddItemModal from "../components/Factura/AddItemModal";
import { useEffect, useState } from "react";
import DetalleFactura from "../components/Factura/DetalleFactura";
import Encabezado from "../components/Factura/Encabezado";
import { createComprobante, getActiveTimbrado } from "../services/CajaService";
import { getBasicInfo } from "../services/BasicsService";
import { CurrencyFormatter } from "../components/Constants";
import { Button } from "flowbite-react";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import SummaryModal from "../components/Factura/SummaryModal";

function FacturaPage() {
  const { user } = useAuth();
  const history = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [detalleList, setDetalleList] = useState([]);
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
        setTimbrado(res.data[0]);
        setFactura({
          ...factura,
          comprobante: {
            ...factura.comprobante,
            ["nro_factura"]: res.data[0].ultimo_numero + 1,
            ["id_timbrado"]: res.data[0].id_timbrado,
          },
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
    const total = detalleList?.reduce(
      (total, item) => total + Number(item.monto),
      0
    );

    let aux_array = [];
    detalleList.forEach((detalle) => {
      aux_array.push(detalle.id_arancel);
    });

    setFactura({
      ...factura,
      comprobante: { ...factura.comprobante, ["monto"]: total },
      aranceles: aux_array,
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

  const onSetData = (data) => {
    const filteredData = data.filter(
      (detalle) => !detalleList.some((d) => d.id_arancel === detalle.id_arancel)
    );
    setDetalleList([...detalleList, ...filteredData]);
  };

  const validate = () => {
    if (factura.comprobante.id_cliente === "") {
      toast.error("Debe seleccionar un cliente");
      return false;
    }
    if (factura.aranceles.length === 0) {
      toast.error("Debe seleccionar al menos un concepto de pago");
      return false;
    }
    if (factura.comprobante.monto === 0) {
      toast.error("Debe seleccionar al menos un concepto de pago");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
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
    window.location.reload();
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
        setData={(data) => onSetData(data)}
        action={() => {}}
      />
      <div className="flex flex-col px-8 gap-y-2 pb-3 bg-blue-100 w-full h-full ">
        <div className="flex flex-row p-3 gap-3 text-4xl font-bold items-center">
          <FaFileInvoiceDollar className="text-cyan-600" />
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

export default FacturaPage;
