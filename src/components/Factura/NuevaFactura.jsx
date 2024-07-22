import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DetalleFactura from "./DetalleFactura";
import Encabezado from "./Encabezado";
import {
  createComprobante,
  getActiveTimbrado,
  getFormaPago,
} from "../../services/CajaService";
import { getBasicInfo } from "../../services/BasicsService";
import { CurrencyFormatter, DateFormatter } from "../Constants";
import { Breadcrumb, Button, Select, Tooltip } from "flowbite-react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { BiError } from "react-icons/bi";
import SummaryModal from "./SummaryModal";
import Cliente from "./Cliente";
import AddItemModal from "./AddItemModal";

function NuevaFactura({ onClose }) {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [organization, setOrganization] = useState();
  const [formasPago, setFormasPago] = useState([]);
  const [detalleList, setDetalleList] = useState({
    aranceles: [],
    ventas: [],
    actividades: [],
    descuentos: [],
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
      tipo_pago: null,
      monto: 0,
      id_formaPago: null,
    },
    aranceles: [],
    pagoventas: [],
    actividades: [],
    descuentos: [],
  });

  useEffect(() => {
    const fetchBasics = async () => {
      try {
        const res01 = await getFormaPago();
        console.log(res01.data);
        setFormasPago(res01.data);
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

    total += detalleList.ventas?.reduce(
      (total, item) => total + Number(item.monto),
      0
    );

    total += detalleList.actividades?.reduce(
      (total, item) => total + Number(item.monto),
      0
    );

    total += detalleList.descuentos?.reduce(
      (total, item) => total - Number(item.monto),
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

    let aux_actividades = [];
    detalleList.actividades.forEach((actividad) => {
      const a = {
        id_actividad: actividad.id_actividad,
        id_matricula: actividad.id_matricula,
        monto: actividad.monto,
      };
      aux_actividades.push(a);
    });

    let aux_descuentos = [];
    detalleList.descuentos?.forEach((descuento) => {
      const a = {
        id_arancel: descuento.id_arancel,
        monto: descuento.monto,
        id_beca: descuento.id_beca,
      };
      aux_descuentos.push(a);
    });

    setFactura({
      ...factura,
      comprobante: { ...factura.comprobante, ["monto"]: total },
      aranceles: aux_aranceles,
      pagoventas: aux_ventas,
      actividades: aux_actividades,
      descuentos: aux_descuentos,
    });

    console.log("factura:", factura);
    console.log("detalle", detalleList);
  }, [detalleList]);

  const onSetCliente = (cliente) => {
    setFactura({
      ...factura,
      comprobante: {
        ...factura.comprobante,
        ["id_cliente"]: cliente.id_cliente,
      },
    });
  };

  const onSetData = (detalle) => {
    console.log("detalle", detalle);
    const filteredAranceles = detalle.aranceles.filter(
      (arancel) =>
        !detalleList.aranceles.some((d) => d.id_arancel == arancel.id_arancel)
    );
    const filteredVentas = detalle.ventas.filter(
      (venta) => !detalleList.ventas.some((d) => d.id_pago == venta.id_pago)
    );

    const filteredActividades = detalle.actividades.filter(
      (actividad) =>
        !detalleList.actividades.some(
          (d) => d.id_actividad == actividad.id_actividad
        )
    );

    const filteredDescuentos = detalle.descuentos.filter(
      (descuento) =>
        !detalleList.descuentos.some(
          (d) => d.id_arancel == descuento.id_arancel
        )
    );

    setDetalleList({
      ...detalleList,
      aranceles: [...detalleList.aranceles, ...filteredAranceles],
      ventas: [...detalleList.ventas, ...filteredVentas],
      actividades: [...detalleList.actividades, ...filteredActividades],
      descuentos: [...detalleList.descuentos, ...filteredDescuentos],
    });
  };

  const validate = () => {
    if (!factura.comprobante.tipo_pago) {
      toast.error("Seleccione la condicion de venta");
      return false;
    }
    if (!factura.comprobante.id_formaPago) {
      toast.error("Seleccione una forma de pago");
      return false;
    }
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
    const res = await getBasicInfo();
    setOrganization(res.data);
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

  const handleChange = (name, value) => {
    setFactura({
      ...factura,
      comprobante: { ...factura.comprobante, [name]: value },
    });
    console.log(factura.comprobante);
  };

  return (
    <>
      <SummaryModal
        show={showSummaryModal}
        onClose={() => onCloseSummary()}
        comprobante={factura.comprobante}
        detalleList={detalleList}
        organization={organization}
      />
      <AddItemModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        setData={(detalle) => onSetData(detalle)}
        action={() => {}}
        cliente={factura.comprobante.id_cliente}
      />
      <div className="flex flex-col px-8 gap-y-2 pb-3 w-3/4 h-full ">
        {/* encabezado de la factura */}
        {/* <div className="flex flex-col bg-white p-4 border rounded mt-3">
          <Encabezado timbrado={timbrado} info={info} />
        </div> */}
        {/* <Breadcrumb>
          <Breadcrumb.Item href="/factura">Facturas</Breadcrumb.Item>
          <Breadcrumb.Item href="/factura/nuevo">Nueva</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="flex p-4 mt-3 bg-white border rounded justify-between items-center">
          <span className="font-sans">
            <b>Fecha: </b>
            {DateFormatter(new Date()).toUpperCase()}
          </span>
          <span className="flex items-center gap-3">
            <b>Condicion de Venta: </b>
            <Select
              className="w-32"
              name="tipo_pago"
              value={factura.comprobante.tipo_pago}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            >
              <option value=""></option>
              <option value="Contado">Contado</option>
              <option value="Credito">Credito</option>
            </Select>
          </span>
          <span className="flex items-center gap-3">
            <b>Forma de Pago: </b>
            <Select
              name="id_formaPago"
              value={factura.comprobante?.id_formaPago}
              onChange={(e) =>
                handleChange(e.target.name, parseInt(e.target.value))
              }
            >
              <option value=""></option>
              {formasPago?.map((item) => (
                <option key={item.id_formaPago} value={item.id_formaPago}>
                  {item.nombre}
                </option>
              ))}
            </Select>
          </span>
        </div>

        {/* datos del cliente */}
        <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded">
          <Cliente setCliente={(cliente) => onSetCliente(cliente)} />
        </div>

        {/* detalle de la factura */}
        <div className="flex flex-col gap-4 bg-white p-4 border rounded-lg divide-y">
          <div className="flex flex-row justify-between items-end">
            <p className="font-bold text-2xl">Detalle de la Factura</p>
            <div className="flex w-14 items-center gap-2 text-3xl justify-end">
              <Tooltip content="Agregar Pago" placement="top">
                <FaRegPlusSquare
                  className="cursor-pointer"
                  onClick={() => setShowAddModal(true)}
                />
              </Tooltip>
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
