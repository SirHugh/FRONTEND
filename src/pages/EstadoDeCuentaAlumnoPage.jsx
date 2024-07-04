import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";
import { getArancel } from "../services/CajaService";
import { getMatricula, getPeriodo } from "../services/AcademicoService";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter, Months } from "../components/Constants";

const EstadoDeCuentaAlumnoPage = ({ idAlumno }) => {
  const [aranceles, setAranceles] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [matricula, setMatricula] = useState(null);

  useEffect(() => {
    const fetchPeriodoMatriculaAranceles = async () => {
      try {
        // 1. Obtener el período activo
        const periodoRes = await getPeriodo(true);
        console.log("Periodo activo: "+ JSON.stringify(periodoRes.data[0]))
        const periodoActivo = periodoRes.data[0].periodo; // Suponiendo que el primer resultado es el periodo activo
        setPeriodoActual(periodoActivo);

        // 2. Obtener las matrículas del alumno para el período activo
        const matriculaRes = await getMatricula(periodoActivo, null, idAlumno, 1);
        const matriculaAlumno = matriculaRes.data[0]; // Suponiendo que el primer resultado es la matricula activa del alumno
        setMatricula(matriculaAlumno);

        if (matriculaAlumno) {
          // 3. Obtener los aranceles asociados a la matrícula
          const arancelRes = await getArancel(true, matriculaAlumno.id_matricula);
          setAranceles(arancelRes.data);
        } else {
          toast.error("No se encontraron matrículas para el alumno.");
        }
      } catch (error) {
        toast.error("Error al cargar los datos: " + error.message);
      }
    };

    fetchPeriodoMatriculaAranceles();
  }, [idAlumno]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta del Alumno</h1>
      {matricula && (
        <div className="mb-4">
          <p>
            Alumno: {matricula.id_alumno.nombre} {matricula.id_alumno.apellido}
          </p>
          <p>Cédula: {matricula.id_alumno.cedula}</p>
          <p>Grado/Curso: {matricula.id_grado.grado}</p>
          <p>Periodo: {matricula.anio_lectivo}</p>
        </div>
      )}
      <Table>
        <Table.Head>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Precio</Table.HeadCell>
          <Table.HeadCell>Mes</Table.HeadCell>
          <Table.HeadCell>Nro. Cuota</Table.HeadCell>
          <Table.HeadCell>Vencimiento</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {aranceles.map((arancel, index) => (
            <Table.Row key={index}>
              <Table.Cell>{arancel.id_producto.nombre}</Table.Cell>
              <Table.Cell>{CurrencyFormatter(arancel.monto)}</Table.Cell>
              <Table.Cell>{Months[new Date(arancel.fecha_vencimiento).getMonth()].name}</Table.Cell>
              <Table.Cell>{arancel.nro_cuota}</Table.Cell>
              <Table.Cell>{DateFormatter(new Date(arancel.fecha_vencimiento))}</Table.Cell>
              <Table.Cell>{arancel.es_activo ? "Pendiente" : "Pagado"}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default EstadoDeCuentaAlumnoPage;
