import { Button, Checkbox, Label, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { getProducto } from "../../services/CajaService";
import toast from "react-hot-toast";
import MonthSelect from "../MonthSelect";
import { CurrencyFormatter, DateFormatter, Months } from "../Constants";

const Confirmacion = ({ show, onClose, matricula }) => {
  const [aranceles, setAranceles] = useState([]);
  const mesActual = new Date().getMonth() + 1;
  const [aplicarArancel, setAplicarArancel] = useState([]);
  const [diaVencimiento, setDiaVencimiento] = useState(10);

  useEffect(() => {
    const getAranceles = async () => {
      try {
        const res = await getProducto(matricula?.id_grado.id_grado, "AR");
        setAranceles(res.data);
        console.log(res.data);
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
    console.log("Aranceles: ", aranceles);
  };

  const validate = () => {
    return true;
  };

  const generarAranceles = () => {
    // if (!validate()) return;
    setAplicarArancel([]);
    const añoLectivo = matricula?.anio_lectivo;
    aranceles.forEach((arancel) => {
      if (arancel.aplicar) {
        console.log("Generar", arancel);
        const desde = Number(arancel.desde);
        const hasta = arancel.hasta
          ? Number(arancel.hasta)
          : Number(arancel.desde);
        var nro_cuota = 1;
        for (let mes = desde; mes < hasta + 1; mes++) {
          let fecha = new Date(añoLectivo, mes - 1, diaVencimiento);
          let i = 1;
          while (fecha.getDay() === 0 || fecha.getDay() === 6) {
            fecha = new Date(añoLectivo, mes - 1, diaVencimiento + i);
            i++;
          }
          const data = {
            id_matricula: matricula.id_matricula,
            id_producto: arancel.id_producto,
            fecha_vencimiento: fecha,
            nro_cuota: nro_cuota,
            monto: arancel.precio,
            es_activo: true,
          };
          console.log(data);
          setAplicarArancel((prevFormValues) => {
            return [...prevFormValues, data];
          });
          nro_cuota++;
        }
      }
    });
    console.log("Aranceles a Aplicar: ", aplicarArancel);
  };

  return (
    <>
      <Modal show={show} onClose={onClose} size="4xl" popup>
        <Modal.Header>Confirmacion de Matriculación</Modal.Header>
        <Modal.Body className="flex flex-col gap-3">
          <div className="border p-2">
            <div className="mb-2 block">
              <Label htmlFor="nombre" value="Datos del Alumno" />
            </div>
            <div className="flex flex-row gap-3">
              <p>
                {matricula?.id_alumno.nombre} {matricula?.id_alumno.apellido}
              </p>
              <p>Cedula: {matricula?.id_alumno.cedula}</p>
              <p>Grado/Curso: {matricula?.id_grado.grado}</p>
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
                <Table.HeadCell>a</Table.HeadCell>
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
                      {ar.es_mensual ? "Mensual" : "Unico"}
                    </Table.Cell>
                    <Table.Cell className="p-1">
                      <MonthSelect
                        name={"desde"}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </Table.Cell>
                    <Table.Cell className="p-1">
                      {ar.es_mensual && (
                        <MonthSelect
                          name={"hasta"}
                          onChange={(e) => handleChange(index, e)}
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button onClick={generarAranceles}>Generar</Button>
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
                      {Months[ar.fecha_vencimiento.getMonth()].name}
                    </Table.Cell>
                    <Table.Cell>{ar.nro_cuota}</Table.Cell>
                    <Table.Cell>{CurrencyFormatter(ar.monto)}</Table.Cell>
                    <Table.Cell>
                      {DateFormatter(ar.fecha_vencimiento)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button>Confirmar Matricula</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Confirmacion;
