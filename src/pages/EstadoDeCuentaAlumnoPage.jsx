import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";
import { getArancel } from "../services/CajaService";
import { getMatricula, getPeriodo, searchMatricula, getAlumnoById } from "../services/AcademicoService";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter, Months } from "../components/Constants";
import { useParams } from 'react-router-dom';

const EstadoDeCuentaAlumnoPage = ({ idAlumno }) => {
  const [aranceles, setAranceles] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPeriodoMatriculaAranceles = async () => {
      try {
        // 1. Obtener el período activo
        const periodoRes = await getPeriodo(true);
        const periodoActivo = periodoRes.data[0]; // Suponiendo que el primer resultado es el periodo activo
        setPeriodoActual(periodoActivo);

        // 2. Obtener la cedula del alumno
        const alumnoRes = await getAlumnoById(id);
        const alumnoData = alumnoRes.data;
        setAlumno(alumnoData);

        // 3. Obtener las matrículas del alumno para el período activo
        const matriculaRes = await searchMatricula(true, alumnoData.cedula, "");
        const matriculaAlumno = matriculaRes.data; // Suponiendo que el primer resultado es la matrícula activa del alumno
        setMatricula(matriculaAlumno);

        // 4. Obtener los aranceles asociados a la matrícula
        if (matriculaAlumno) {
          const arancelRes = await getArancel(true, matriculaAlumno.id_matricula);
          const arancelAlumno = arancelRes.data;
          setAranceles(arancelAlumno);
          
        } else {
          toast.error("No se encontraron matrículas para el alumno.");
        }
      } catch (error) {
        toast.error("Error al cargar los datos: " + error.message);
      }
    };

    console.log("Aranceles " + JSON.stringify(aranceles));
    fetchPeriodoMatriculaAranceles();
  }, [id]);

  // Extraer la cédula de los aranceles y filtrar
  const filteredAranceles = aranceles.filter(arancel => {
    if (arancel.alumno) {
      const [arancelCedula] = arancel.alumno.split("-");
      return arancelCedula === alumno.cedula;
    }
    return false;
  });

  console.log("Datos filtrados de aranceles: "+JSON.stringify(filteredAranceles))
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta del Alumno</h1>
      {matricula && (
        <div className="mb-4">
          <p>
            Alumno: {alumno.nombre} {alumno.apellido}
          </p>
          <p>Cédula: {alumno.cedula}</p>
          <p>Grado/Curso: {matricula.id_grado}</p>
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
          {aranceles.length > 0 ? (
            aranceles.map((arancel, index) => (
              <Table.Row key={index}>
                <Table.Cell>{arancel.id_producto}</Table.Cell>
                <Table.Cell>{CurrencyFormatter(arancel.monto)}</Table.Cell>
                <Table.Cell>{Months[new Date(arancel.fecha_vencimiento).getMonth()].name}</Table.Cell>
                <Table.Cell>{arancel.nro_cuota}</Table.Cell>
                <Table.Cell>{DateFormatter(new Date(arancel.fecha_vencimiento))}</Table.Cell>
                <Table.Cell>{arancel.es_activo ? "Pendiente" : "Pagado"}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan="6">No se encontraron aranceles para este alumno.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default EstadoDeCuentaAlumnoPage;
