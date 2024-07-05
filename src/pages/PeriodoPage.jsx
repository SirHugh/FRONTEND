import { useEffect, useState } from "react";
import { Button, Table, Select } from "flowbite-react";
import { getArancel } from "../services/CajaService";
import { getPeriodo, searchMatricula, getAlumnoById } from "../services/AcademicoService";
import toast from "react-hot-toast";
import { CurrencyFormatter, DateFormatter, Months } from "../components/Constants";
import { useParams } from 'react-router-dom';

const EstadoDeCuentaAlumnoPage = ({ idAlumno }) => {
  const [aranceles, setAranceles] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [alumno, setAlumno] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const { id } = useParams();

  const fetchPeriodoMatriculaAranceles = async (periodo) => {
    try {
      // 1. Obtener la cedula del alumno
      const alumnoRes = await getAlumnoById(id);
      const alumnoData = alumnoRes.data;
      setAlumno(alumnoData);

      // 2. Obtener las matrículas del alumno para el período seleccionado
      const matriculaRes = await searchMatricula(true, alumnoData.cedula, "", periodo);
      const matriculaAlumno = matriculaRes.data[0]; // Suponiendo que el primer resultado es la matrícula activa del alumno
      setMatricula(matriculaAlumno);

      // 3. Obtener los aranceles asociados a la matrícula (activos e inactivos)
      if (matriculaAlumno) {
        const arancelActivoRes = await getArancel(true, matriculaAlumno.id_matricula);
        const arancelInactivoRes = await getArancel(false, matriculaAlumno.id_matricula);
        const arancelAlumno = [...arancelActivoRes.data, ...arancelInactivoRes.data];
        setAranceles(arancelAlumno);
      } else {
        toast.error("No se encontraron matrículas para el alumno.");
      }
    } catch (error) {
      toast.error("Error al cargar los datos: " + error.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener todos los periodos
        const periodoRes = await getPeriodo();
        const allPeriodos = periodoRes.data;
        setPeriodos(allPeriodos);

        // Obtener el período activo
        const periodoActivo = allPeriodos.find(periodo => periodo.es_activo);
        setPeriodoActual(periodoActivo);

        // Fetch datos iniciales con el período activo
        fetchPeriodoMatriculaAranceles(periodoActivo.periodo);
      } catch (error) {
        toast.error("Error al cargar los datos iniciales: " + error.message);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (aranceles.length > 0) {
      console.log("Aranceles", JSON.stringify(aranceles));
    }
  }, [aranceles]);

  if (!alumno) {
    return <div>Cargando...</div>;
  }

  const handlePeriodoChange = (event) => {
    const selectedPeriodo = event.target.value;
    const periodoSeleccionado = periodos.find(periodo => periodo.periodo === selectedPeriodo);
    setPeriodoActual(periodoSeleccionado);
    fetchPeriodoMatriculaAranceles(selectedPeriodo);
  };

  console.log("Alumno", alumno);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta del Alumno</h1>
      {matricula && (
        <div className="mb-4">
          <p>
            Alumno: {alumno.nombre} {alumno.apellido}
          </p>
          <p>Cédula: {alumno.cedula}</p>
          <p>Grado/Curso: {matricula.id_grado.nombre + " grado"}</p>
          <p className="flex items-center">
            Periodo: 
            <select 
              value={periodoActual?.periodo || ''} 
              onChange={handlePeriodoChange} 
              className="ml-2 p-2 border rounded"
            >
              {periodos.map(periodo => (
                <option key={periodo.periodo} value={periodo.periodo}>
                  {periodo.periodo}
                </option>
              ))}
            </select>
          </p>
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
                <Table.Cell>{arancel.nombre}</Table.Cell>
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
