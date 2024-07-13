import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { Accordion, Alert, Avatar, Card, Table, Tabs } from "flowbite-react";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  getEstadoDeCuenta,
  getMatricula,
  getMatriculasAlumnoId,
  getPeriodo,
  searchAlumnos,
  searchMatricula,
} from "../services/AcademicoService";
import toast from "react-hot-toast";
import { BsCashCoin } from "react-icons/bs";
import {
  CurrencyFormatter,
  DateFormatter,
  Months,
} from "../components/Constants";
import { Tab } from "react-tabs";

const EstadoDeCuentaPage = () => {
  const [aranceles, setAranceles] = useState([]);
  const [periodoId, setPeriodoId] = useState("");
  const [EstadoDeCuenta, setEstadoDeCuenta] = useState([]);

  const [periodos, setPeriodos] = useState([]);
  const [alumno, setAlumno] = useState(null);
  const [matriculaciones, setMatriculaciones] = useState([]);
  const [alumnoId, setAlumnoId] = useState(null);
  const blueColor = "#3B82F6";

  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelecteValue] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getPeriodo();
      setPeriodos(res.data);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedValue) return;
    const loadMatriculas = async () => {
      try {
        const res = await getMatriculasAlumnoId(
          periodoId,
          selectedValue.id_alumno
        );
        console.log(res.data);
        setMatriculaciones(res.data);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    loadMatriculas();
  }, [selectedValue]);

  const loadOptions = async () => {
    if (inputValue.length < 2) return;
    return searchAlumnos(1, inputValue).then((result) => {
      const res = result.data.results;
      return res;
    });
  };

  const handleInputChange = (value) => {
    setValue(value);
  };

  const handleChange = async (value) => {
    setSelecteValue(value);
    console.log("Alumno: ", value);
  };

  const handleMatriculaSelected = async (id_matricula) => {
    try {
      const res = await getEstadoDeCuenta(id_matricula);
      console.log(res.data);
      setEstadoDeCuenta(res.data);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const ageInMilliseconds = today.getTime() - dob.getTime();
    const ageInYears = Math.floor(ageInMilliseconds / 31536000000); // 31536000000 = 1000 * 60 * 60 * 24 * 365.25
    return ageInYears;
  };

  return (
    <div>
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <BsCashCoin style={{ color: blueColor }} />
        <h1 className="">ESTADO DE CUENTAS</h1>
      </div>
      {/* <div className="relative flex w-full justify-center "> */}
      <div className="flex flex-row w-full gap-5 p-5 ">
        <div className="flex flex-col gap-5 border rounded-lg h-fit">
          <div className="p-3">
            <div className="flex flex-col items-center">
              <big className="font-bold">Cuentas Del Alumno</big>
              <span className="font-serif text-red-700 ">pagos y deudas</span>
            </div>
            <div className="items-center gap-3">
              <b className="text-xl">Buscar Alumno</b>
              <div className="w-96">
                <AsyncSelect
                  noOptionsMessage={() => "No se encuentran resultados"}
                  placeholder="Nombre, Apellido, CI..."
                  cacheOptions
                  defaultOptions
                  value={selectedValue}
                  loadOptions={loadOptions}
                  onInputChange={handleInputChange}
                  onChange={handleChange}
                  getOptionLabel={(e) => e.nombre + " " + e.apellido}
                  getOptionValue={(e) => e.id_alumno}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col max-w-lg gap-5">
            <div className="flex flex-row  px-7 py-2 gap-5 items-center">
              {selectedValue?.fotocarnet ? (
                <Avatar
                  img={selectedValue?.fotocarnet}
                  size="lg"
                  rounded
                  bordered
                />
              ) : (
                <Avatar size="lg" rounded />
              )}
              <div>
                <h5 className=" text-xl font-medium text-gray-900 dark:text-white">
                  {selectedValue?.nombre}
                </h5>
                <h5 className=" text-xl font-medium text-gray-900 dark:text-white">
                  {selectedValue?.apellido}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CI. {selectedValue?.cedula}
                </p>
               {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                  Edad. {calculateAge(selectedValue?.fecha_nac)}
                  {" años"}
                </p>*/}
              </div>
            </div>
            <div className="flow-root">
              <div className="mb-4 flex items-center justify-center">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  Matriculaciones
                </h5>
              </div>
              <ul className="divide-y border-y divide-gray-200 dark:divide-gray-700 px-3">
                {matriculaciones.map((matriculacion) => (
                  <li
                    key={matriculacion.id_matricula}
                    className="py-3 sm:py-4 cursor-pointer  hover:bg-slate-200"
                    onClick={() =>
                      handleMatriculaSelected(matriculacion.id_matricula)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {matriculacion.id_grado.grado
                            ? matriculacion.id_grado.grado +
                              "° " +
                              matriculacion.id_grado.nombre
                            : matriculacion.id_grado.nombre}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {matriculacion.id_grado.turno}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {matriculacion.anio_lectivo}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full border rounded-lg">
          <Tabs>
            <Tabs.Item title="Aranceles">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Nro Cuota</Table.HeadCell>
                  <Table.HeadCell>Arancel</Table.HeadCell>
                  <Table.HeadCell>Monto</Table.HeadCell>
                  <Table.HeadCell>Vencimiendo</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                  <Table.HeadCell>Nro Factura</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {EstadoDeCuenta &&
                    EstadoDeCuenta.aranceles?.map((arancel) => (
                      <Table.Row key={arancel.id_arancel}>
                        <Table.Cell>{arancel.nro_cuota}</Table.Cell>
                        <Table.Cell>{arancel.nombre}</Table.Cell>
                        <Table.Cell>
                          {CurrencyFormatter(parseFloat(arancel.monto))}
                        </Table.Cell>
                        <Table.Cell>{arancel.fecha_vencimiento}</Table.Cell>
                        <Table.Cell>{arancel.id_comprobante}</Table.Cell>

                        <Table.Cell
                          className={`${
                            arancel.es_activo
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {arancel.es_activo ? "Pendiente" : "Cancelado"}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </Tabs.Item>
            <Tabs.Item title="Ventas">
              <Table>
                <Table.Head>
                  <Table.HeadCell>N° Venta</Table.HeadCell>
                  <Table.HeadCell>N° cuota</Table.HeadCell>
                  <Table.HeadCell>Descripción</Table.HeadCell>
                  <Table.HeadCell>Vencimiento</Table.HeadCell>
                  <Table.HeadCell>Monto</Table.HeadCell>
                  <Table.HeadCell>Factura</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {EstadoDeCuenta &&
                    EstadoDeCuenta.ventas?.map((venta) => (
                      <Table.Row key={venta.id_pago}>
                        <Table.Cell>{venta.id_venta}</Table.Cell>
                        <Table.Cell>
                          {venta.nro_pago}/{venta.nroPagos}
                        </Table.Cell>
                        <Table.Cell>
                          {venta.descripcion.map((detalle) => (
                            <>
                              {detalle.producto}({detalle.cantidad}){", "}
                            </>
                          ))}
                        </Table.Cell>
                        <Table.Cell>{venta.fecha_vencimiento}</Table.Cell>
                        <Table.Cell>
                          {CurrencyFormatter(parseFloat(venta.monto))}
                        </Table.Cell>
                        <Table.Cell>{venta.nroFactura}</Table.Cell>
                        <Table.Cell
                          className={`${
                            venta.es_activo ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {venta.es_activo ? "Pendiente" : "Cancelado"}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </Tabs.Item>
            <Tabs.Item title="Actividades">
              <Table>
                <Table.Head>
                  <Table.HeadCell>N° Actividad</Table.HeadCell>
                  <Table.HeadCell>Descripción</Table.HeadCell>
                  <Table.HeadCell>Monto</Table.HeadCell>
                  <Table.HeadCell>Fecha Pago</Table.HeadCell>
                  <Table.HeadCell>Factura</Table.HeadCell>
                  <Table.HeadCell>Estado</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {EstadoDeCuenta &&
                    EstadoDeCuenta.actividad_pendiente?.map((actividad) => (
                      <Table.Row key={actividad.id_actividad}>
                        <Table.Cell>{actividad.id_actividad}</Table.Cell>
                        <Table.Cell>{actividad.actividad}</Table.Cell>
                        <Table.Cell>
                          {CurrencyFormatter(parseFloat(actividad.monto))}
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell className="text-green-500">
                          Pendiente
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  {EstadoDeCuenta.actividad_pagos?.map((actividad) => (
                    <Table.Row key={actividad.id_actividad}>
                      <Table.Cell>{actividad.id_actividad}</Table.Cell>
                      <Table.Cell>{actividad.actividad}</Table.Cell>
                      <Table.Cell>
                        {CurrencyFormatter(parseFloat(actividad.monto))}
                      </Table.Cell>
                      <Table.Cell>{actividad.fecha_pago}</Table.Cell>
                      <Table.Cell>{actividad.nro_factura}</Table.Cell>
                      <Table.Cell className="text-red-500">
                        Cancelado
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default EstadoDeCuentaPage;
