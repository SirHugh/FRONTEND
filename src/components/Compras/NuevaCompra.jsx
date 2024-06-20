import {
  Button,
  Label,
  Select,
  TextInput,
  Toast,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { CurrencyFormatter } from "../Constants";
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
import {
  createCompra,
  createVenta,
  getFlujoCajaCurrent,
} from "../../services/CajaService";
import { MdAddBusiness, MdAddShoppingCart } from "react-icons/md";
import ListaDetalle from "./ListaDetalle";

function NuevaCompra({ onClose }) {
  const { user } = useAuth();
  const [detalleList, setDetalleList] = useState([]);
  const [id_flujoCaja, setId_flujoCaja] = useState(null);
  const [financiamiento, setFinanciamiento] = useState(0);

  const [formData, setFormData] = useState({
    compra: {
      id_flujoCaja: null,
      fecha: null,
      monto: 0,
      nro_factura: null,
      id_usuario: user.user_id,
    },
    detalle: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFlujoCajaCurrent();
        console.log(res.data);
        setId_flujoCaja(res.data.id_flujoCaja);
      } catch (error) {
        toast.error(error.response.data.error);
        console.log(error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let total = 0;
    let aux_array = [];
    detalleList.forEach((detalle) => {
      let auxDet = {};
      auxDet.precio = detalle.costo;
      auxDet.id_producto = detalle.id_producto;
      auxDet.cantidad = detalle.cantidad;
      aux_array.push(auxDet);
      total = total + (detalle.costo * detalle.cantidad || 0);
    });
    setFormData({
      ...formData,
      compra: { ...formData.compra, ["monto"]: total },
      detalle: aux_array,
    });
    console.log("formdata", formData);
  }, [detalleList]);

  const validate = () => {
    if (
      formData.compra.fecha === null ||
      formData.compra.nro_factura === null ||
      financiamiento === 0
    ) {
      toast.error("Debe completar los campos obligatorios", {
        duration: 5000,
        icon: <BiError color="red" fontSize="1.5rem" />,
      });
      return false;
    }
    if (formData.detalle.length === 0) {
      toast.error("Debe seleccionar al menos un producto", {
        duration: 5000,
        icon: <BiError color="red" fontSize="1.5rem" />,
      });
      return false;
    }
    if (formData.compra.monto === 0) {
      toast.error("Debe seleccionar al menos un producto", {
        duration: 5000,
        icon: <BiError color="red" fontSize="1.5rem" />,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    if (!window.confirm("Desea Confirmar los datos de la compra?")) {
      toast.error("Operacion Cancelada");
      return;
    }
    console.log("formdata", formData);
    try {
      await createCompra(formData);
      toast.success("Compra Registrada");
      onClose();
    } catch (error) {
      toast.error(error.response.data.error);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "financiamiento") {
      name = "id_flujoCaja";
      setFinanciamiento(parseInt(value));
      Number(value) === 1 ? (value = id_flujoCaja) : (value = null);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      compra: { ...prevFormData.compra, [name]: value },
    }));
    console.log(formData);
  };

  return (
    <div className="flex flex-col px-4 gap-y-2 pb-3 bg-slate-200 w-full h-full ">
      <div className="flex flex-row p-3 gap-3 text-2xl font-bold items-center">
        <MdAddBusiness className="text-cyan-600" />
        <h1 className="">Registro de Compra</h1>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4 font-bold bg-white p-4 border rounded-lg">
            Datos de la Compra
            <div className="flex flex-row gap-4">
              <Label>
                Fecha <b className="text-red-700 font-bold">*</b>
                <TextInput
                  className="flex w-52"
                  type="date"
                  name="fecha"
                  value={formData.compra.fecha}
                  onChange={(e) => handleChange(e)}
                />
              </Label>
              <Label>
                Nro. Factura/Comprobante{" "}
                <b className="text-red-700 font-bold">*</b>
                <TextInput
                  className="flex w-52"
                  type="number"
                  min={0}
                  name="nro_factura"
                  value={formData.compra.nro_factura}
                  onChange={(e) => handleChange(e)}
                />
              </Label>
              <Label>
                Financiamiento <b className="text-red-700">*</b>
                <Select
                  className="flex w-52"
                  name="financiamiento"
                  onChange={(e) => handleChange(e)}
                >
                  <option value={0}></option>
                  <option disabled={id_flujoCaja ? false : true} value={1}>
                    Extraccion de Caja
                  </option>
                  <option value={2}>Fondo Externo</option>
                </Select>
              </Label>
            </div>
            <small className="text-red-700 ">* Campos Obligatorios</small>
          </div>
          <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg font-bold">
            <ListaDetalle
              detalleList={detalleList}
              setDetalleList={setDetalleList}
            />
          </div>
          <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
            <div className="flex flex-row justify-end p-5 gap-3">
              <p className="flex font-bold w-52">TOTAL</p>
              <p>{CurrencyFormatter(formData.compra.monto)} gs.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end p-2 gap-4">
        <Button onClick={handleSubmit}>Guardar</Button>
      </div>
    </div>
  );
}

export default NuevaCompra;
