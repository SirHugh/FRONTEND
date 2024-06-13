import { Button, Checkbox, Label, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { createArancel, getProducto } from "../../services/CajaService";
import toast, { Toaster } from "react-hot-toast";
import MonthSelect from "../MonthSelect";
import { CurrencyFormatter, DateFormatter, Months } from "../Constants";
import { setMatriculaActive } from "../../services/AcademicoService";
import moment from "moment";

const Confirmacion = ({ show, onClose, periodoActual, matricula }) => {
  const [aranceles, setAranceles] = useState([]);
  const [aplicarArancel, setAplicarArancel] = useState([]);

  useEffect(() => {
    const getAranceles = async () => {
      try {
        const res = await getProducto(matricula?.id_grado?.id_grado, "AR");

        const fecha_inicio_periodo = new Date(periodoActual?.fecha_inicio);
        const fecha_fin_periodo = new Date(periodoActual?.fecha_fin);
        const fecha_inscripcion = new Date(matricula?.fecha_inscripcion);
        const auxiliary = [];

        res.data.forEach((item, index) => {
          const desde = item.es_mensual
            ? item.es_mensual
            : fecha_inicio_periodo > fecha_inscripcion
            ? fecha_inicio_periodo.getMonth()
            : fecha_inscripcion.getMonth();

          console.log("desde", desde);
          const hasta = !item.es_mensual ? fecha_fin_periodo.getMonth() : false;
          item.desde = desde;
          hasta && (item.hasta = hasta);
          auxiliary.push(item);
        });
        setAranceles(auxiliary);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getAranceles();
  }, [matricula]);

  const handleChange = (index, e) => {
    const { value, name, type, checked } = e.target;
    aranceles[index] = {
      ...aranceles[index],
      [name]: type === "checkbox" ? checked : value,
    };
    generarAranceles();
  };

  const generarAranceles = () => {
    setAplicarArancel([]);
    const periodo = periodoActual.periodo;
    aranceles.forEach((arancel) => {
      if (arancel.aplicar) {
        const desde = arancel.desde;
        const hasta = arancel.hasta
          ? Number(arancel.hasta)
          : Number(arancel.desde);
        var nro_cuota = 1;
        for (let mes = desde; mes <= hasta; mes++) {
          let fecha = new Date(periodo, mes, periodoActual?.vencimiento_pagos);
          let i = 1;
          while (fecha.getDay() === 0 || fecha.getDay() === 6) {
            fecha = new Date(
              periodo,
              mes,
              periodoActual?.vencimiento_pagos + i
            );
            i++;
          }
          const fechaMatriculacion = new Date(matricula.fecha_inscripcion);
          const auxFecha =
            fecha > fechaMatriculacion ? fecha : fechaMatriculacion;
          const data = {
            id_matricula: matricula.id_matricula,
            id_producto: arancel.id_producto,
            fecha_vencimiento: moment(auxFecha).format("YYYY-MM-DD"),
            nro_cuota: nro_cuota,
            monto: arancel.precio,
            es_activo: true,
          };
          setAplicarArancel((prevFormValues) => {
            return [...prevFormValues, data];
          });
          nro_cuota++;
        }
      }
    });
    console.log("Aranceles a Aplicar: ", aplicarArancel);
  };

  const handleSubmit = () => {
    try {
      const res_1 = setMatriculaActive(matricula.id_matricula, true);
      toast.promise(
        res_1,
        {
          loading: "Guardando",
          success: "Alumno confirmado con exito",
          error: "Error al confirmar al alumno",
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
          },
        }
      );
      if (aplicarArancel.length > 0) {
        const res_2 = createArancel(aplicarArancel);
        toast.promise(
          res_2,
          {
            loading: "Guardando",
            success: " Aranceles aplicados con exito",
            error: "Error al aplicar los aranceles",
          },
          {
            style: {
              minWidth: "250px",
            },
            success: {
              duration: 5000,
            },
          }
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
    closeModal();
  };

  const closeModal = () => {
    setAplicarArancel([]);
    setAranceles([]);
    onClose();
  };

  return (
    <>
      <Modal show={show} onClose={closeModal} size="4xl" popup>
        <Modal.Header>Confirmacion de Matriculación</Modal.Header>
        <Modal.Body className="flex flex-col gap-3">
          <div className="border p-2">
            <div className="mb-2 block">
              <Label htmlFor="nombre" value="Datos del Alumno" />
            </div>
            <div className="flex flex-row gap-3">
              <p>
                {matricula?.id_alumno?.nombre} {matricula?.id_alumno?.apellido}
              </p>
              <p>Cedula: {matricula?.id_alumno?.cedula}</p>
              <p>Grado/Curso: {matricula?.id_grado?.grado}</p>

              <p>Periodo: {matricula?.anio_lectivo}</p>
            </div>
          </div>
          <div className="mb-2 p-2 block border">
            <Label htmlFor="nombre" value="Aranceles" />
            <Table>
              <Table.Head>
                <Table.HeadCell className="p-4">Aplicar</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Precio</Table.HeadCell>
                <Table.HeadCell>Pago</Table.HeadCell>
                <Table.HeadCell>Periodo</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divade-y">
                {aranceles?.map((ar, index) => (
                  <Table.Row key={ar?.id_producto}>
                    <Table.Cell>
                      <Checkbox
                        name="aplicar"
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Table.Cell>
                    <Table.Cell>{ar.nombre}</Table.Cell>
                    <Table.Cell>{CurrencyFormatter(ar.precio)}</Table.Cell>
                    <Table.Cell>
                      {ar.es_mensual ? "Unico" : "Mensual"}
                    </Table.Cell>
                    <Table.Cell className="p-1">
                      <MonthSelect
                        value={ar.desde}
                        name={"desde"}
                        onChange={(e) => handleChange(index, e)}
                        disabled={true}
                      />
                    </Table.Cell>
                    <Table.Cell className="p-1">
                      {!ar.es_mensual && (
                        <MonthSelect
                          value={ar.hasta}
                          name={"hasta"}
                          onChange={(e) => handleChange(index, e)}
                          disabled={true}
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="mb-2 p-2 block border">
            <Label htmlFor="nombre" value="Pagos a Generar" />
            <Table>
              <Table.Head>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Mes</Table.HeadCell>
                <Table.HeadCell>Nro. Cuota</Table.HeadCell>
                <Table.HeadCell>Monto</Table.HeadCell>
                <Table.HeadCell>Vencimiento</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {aplicarArancel.map((ar, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      {aranceles.map(
                        (a) => a.id_producto === ar.id_producto && a.nombre
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {Months[new Date(ar.fecha_vencimiento).getMonth()].name}
                    </Table.Cell>
                    <Table.Cell>{ar.nro_cuota}</Table.Cell>
                    <Table.Cell>{CurrencyFormatter(ar.monto)}</Table.Cell>
                    <Table.Cell>
                      {DateFormatter(new Date(ar.fecha_vencimiento))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button
            onClick={(e) => {
              if (
                window.confirm(
                  "¿Desea confirmar los aranceles y al alumno en el periodo actual?"
                )
              ) {
                handleSubmit();
              } else {
                closeModal();
              }
            }}
          >
            Confirmar Matricula
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Confirmacion;
