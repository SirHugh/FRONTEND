import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaFileInvoiceDollar } from "react-icons/fa";
import moment from "moment";
import DatosAlumno from "./DatosAlumno";
import useAuth from "../../hooks/useAuth";
import ListaDetalle from "./ListaDetalle";
import { CurrencyFormatter } from "../Constants";
import { getPeriodo } from "../../services/AcademicoService";
import toast from "react-hot-toast";
import PagoCard from "./PagoCard";
import { BiError } from "react-icons/bi";
import { createVenta } from "../../services/CajaService";

function NuevaVenta({ show, onClose, action }) {
  const { user } = useAuth();
  const [detalleList, setDetalleList] = useState([]);
  const [nro_cuotas, setNro_cuotas] = useState([]);
  const [esCredito, setEsCredito] = useState(false);
  const [periodo, setPeriodo] = useState();
  const [desdeMesActual, setDesdeMesActual] = useState(1);

  const [formData, setFormData] = useState({
    venta: {
      id_venta: "",
      id_usuario: user.user_id,
      id_matricula: 0,
      nro_pagos: 1,
      fecha: moment(new Date()).format("YYYY-MM-DD"),
      monto: 0,
    },
    detalle: [],
    pagos: [],
  });

  useEffect(() => {
    const loadPeriodo = async () => {
      try {
        const res = await getPeriodo(true);
        setPeriodo(res.data[0]);
      } catch (error) {
        toast.error("Error al cargar el periodo academico");
        console.log(error);
      }
    };
    loadPeriodo();
  }, []);

  useEffect(() => {
    let total = 0;
    let aux_array = [];
    detalleList.forEach((detalle) => {
      let auxDet = {};
      auxDet.precio = detalle.precio;
      auxDet.id_producto = detalle.id_producto;
      auxDet.cantidad = detalle.cantidad;
      aux_array.push(auxDet);
      total = total + (detalle.precio * detalle.cantidad || 0);
    });
    const pagos = CalculoCuotaVenta(true, total);
    setFormData({
      ...formData,
      venta: { ...formData.venta, ["monto"]: total },
      detalle: aux_array,
      pagos: pagos,
    });
    console.log("formdata", formData);
  }, [detalleList]);

  const CalculoCuotaVenta = (rtn, total) => {
    const cantidad_cuotas = formData.venta.nro_pagos;
    let monto = total || formData.venta.monto;
    let cuota = monto / cantidad_cuotas;

    console.log("cuota", cuota);
    const resto = cuota % 50;
    console.log("resto", resto);
    if (resto !== 0) {
      cuota = cuota + 50 - resto;
    }

    let arrayAux = [];
    console.log("Mes desde", desdeMesActual);
    const desde = new Date().getMonth() + (desdeMesActual == 1 ? 0 : 1);
    console.log("desde", desde);
    const hasta = desde + Number(cantidad_cuotas);
    let nro_pago = 1;

    for (let mes = desde; mes < hasta; mes++) {
      let fecha = new Date(periodo?.periodo, mes, periodo?.vencimiento_pagos);
      let i = 1;
      while (fecha.getDay() === 0 || fecha.getDay() === 6) {
        fecha = new Date(periodo?.periodo, mes, periodo?.vencimiento_pagos + i);
        i++;
      }
      fecha = moment(fecha).format("YYYY-MM-DD");
      fecha = fecha > formData.venta.fecha ? fecha : formData.venta.fecha;
      const data = {
        fecha_vencimiento: fecha,
        nro_pago: nro_pago,
        monto: cuota > monto ? monto : cuota,
        es_activo: true,
      };
      arrayAux.push(data);
      monto = monto - cuota < 0 ? monto : monto - cuota;
      nro_pago++;
    }
    console.log("arrayAux", arrayAux);
    if (rtn) {
      return arrayAux;
    }
    setFormData({ ...formData, pagos: arrayAux });
  };

  const setMatricula = (m) => {
    setFormData({
      ...formData,
      venta: { ...formData.venta, id_matricula: m },
    });
    console.log(formData);
  };

  const handleCredito = (e) => {
    formData.venta.nro_pagos = e;
    CalculoCuotaVenta();
  };

  useEffect(() => {
    console.log("NewDate", new Date("2024", "12", "01"));
    if (esCredito) {
      setEsCredito(true);
      const cantidad =
        new Date(periodo?.fecha_fin).getMonth() -
        new Date().getMonth() +
        desdeMesActual;

      const array = [...Array(cantidad).keys()].map((i) => i + 1);
      setNro_cuotas(array);
      CalculoCuotaVenta();
    }
    handleCredito(1);
  }, [esCredito, desdeMesActual]);

  const validate = () => {
    if (formData.venta.id_matricula === 0) {
      toast.error("Debe seleccionar un alumno", {
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
    if (formData.venta.monto === 0) {
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
    if (!window.confirm("Are you sure you want to proceed?")) {
      console.log("Proceeding with the action...");
      return;
    }
    console.log("formdata", formData);
    try {
      const res = await createVenta(formData);
      console.log("res", res);
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col px-4 gap-y-2 pb-3 bg-slate-200 w-full h-full ">
      <div className="flex flex-row p-3 gap-3 text-2xl font-bold items-center">
        <FaFileInvoiceDollar className="text-cyan-600" />
        <h1 className="">Registro de Venta</h1>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
            <DatosAlumno setData={(m) => setMatricula(m)} />
          </div>
          <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
            <ListaDetalle
              detalleList={detalleList}
              setDetalleList={setDetalleList}
            />
          </div>
          <div className="flex flex-col gap-4 divide-y bg-white p-4 border rounded-lg">
            <div className="flex flex-row justify-end p-5 gap-3">
              <p className="flex font-bold w-52">TOTAL</p>
              <p>{CurrencyFormatter(formData.venta.monto)} gs.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 bg-white p-4 border rounded-lg">
        <Label>
          Fecha
          <TextInput type="date" value={formData.venta.fecha} readOnly />
        </Label>
        <Label>
          Tipo de Pago
          <Select
            onChange={(e) => setEsCredito(e.target.value == "1" ? true : false)}
          >
            <option value={0}>Contado</option>
            <option value={1}>Credito</option>
          </Select>
        </Label>
        {esCredito && (
          <Label>
            Desde
            <Select
              value={desdeMesActual}
              onChange={(e) => setDesdeMesActual(Number(e.target.value))}
            >
              <option key={1} value={1}>
                {"Mes Actual"}
              </option>
              <option key={0} value={0}>
                {"Mes Siguiente"}
              </option>
            </Select>
          </Label>
        )}
        {esCredito && (
          <Label>
            Nro de Cuotas
            <Select
              value={formData.venta.nro_pagos}
              onChange={(e) => handleCredito(Number(e.target.value))}
            >
              {nro_cuotas.map((nro) => (
                <option key={nro} value={nro}>
                  {nro}
                </option>
              ))}
            </Select>
          </Label>
        )}
      </div>
      <div
        className={`flex flex-row h-full bg-white rounded-lg p-2 gap-2 transition-all ${
          formData.venta.monto > 0 && esCredito ? "h-1/4" : "hidden"
        }`}
      >
        {formData.pagos.map((p) => (
          <PagoCard key={p.nro_pago} pago={p} />
        ))}
      </div>
      <div className="flex justify-end p-2 gap-4">
        <Button onClick={handleSubmit}>Guardar</Button>
      </div>
    </div>
  );
}

export default NuevaVenta;
