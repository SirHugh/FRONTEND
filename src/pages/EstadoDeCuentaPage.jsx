import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { getArancel } from "../services/CajaService";
import {
  getPeriodo,
  searchMatricula,
  getAlumnoById,
} from "../services/AcademicoService";
import toast from "react-hot-toast";
import { BsCashCoin } from "react-icons/bs";
import {
  CurrencyFormatter,
  DateFormatter,
  Months,
} from "../components/Constants";
import BuscadorAlumnos from "../components/Ventas/BuscadorAlumnos"; // Asegúrate de ajustar la ruta de importación si es necesario

const EstadoDeCuentaPage = () => {
  const [aranceles, setAranceles] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [alumno, setAlumno] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const [alumnoId, setAlumnoId] = useState(null);
  const blueColor = "#3B82F6";

  const fetchPeriodoMatriculaAranceles = async (idAlumno, periodo) => {
    try {
      const alumnoRes = await getAlumnoById(idAlumno);
      const alumnoData = alumnoRes.data;
      setAlumno(alumnoData);

      const matriculaRes = await searchMatricula(
        true,
        alumnoData.cedula,
        "",
        periodo
      );
      const matriculaAlumno = matriculaRes.data[0];
      setMatricula(matriculaAlumno);

      if (matriculaAlumno) {
        const arancelActivoRes = await getArancel(
          true,
          matriculaAlumno.id_matricula
        );
        const arancelInactivoRes = await getArancel(
          false,
          matriculaAlumno.id_matricula
        );
        const arancelAlumno = [
          ...arancelActivoRes.data,
          ...arancelInactivoRes.data,
        ];
        setAranceles(arancelAlumno);
      } else {
        toast.error("No se encontraron matrículas para el alumno.");
        setAranceles([]);
      }
    } catch (error) {
      toast.error("Error al cargar los datos: " + error.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const periodoRes = await getPeriodo();
        const allPeriodos = periodoRes.data;
        setPeriodos(allPeriodos);

        const periodoActivo = allPeriodos.find((periodo) => periodo.es_activo);
        setPeriodoActual(periodoActivo);
      } catch (error) {
        toast.error("Error al cargar los datos iniciales: " + error.message);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (aranceles.length > 0) {
      console.log("Aranceles", JSON.stringify(aranceles));
    }
  }, [aranceles]);

  const handlePeriodoChange = (event) => {
    const selectedPeriodo = event.target.value;
    const periodoSeleccionado = periodos.find(
      (periodo) => periodo.periodo === selectedPeriodo
    );
    setPeriodoActual(periodoSeleccionado);
    if (alumnoId) {
      fetchPeriodoMatriculaAranceles(alumnoId, selectedPeriodo);
    }
  };

  const handleAlumnoSelect = (id) => {
    setAlumnoId(id);
    if (periodoActual) {
      fetchPeriodoMatriculaAranceles(id, periodoActual.periodo);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-row p-3 border-b gap-3 text-4xl font-bold items-center">
        <BsCashCoin style={{ color: blueColor }} />
        <h1 className="">ESTADO DE CUENTAS</h1>
      </div>
      <BuscadorAlumnos onAlumnoSelect={handleAlumnoSelect} />
      {alumnoId && (
        <>
          {(matricula || alumno) && (
            <div className="mb-4">
              <p>
                Alumno: {alumno.nombre} {alumno.apellido}
              </p>
              <p>Cédula: {alumno.cedula}</p>
              <p>
                Grado/Curso:{" "}
                {matricula ? matricula.id_grado.nombre + " grado" : ""}
              </p>
              <p className="flex items-center">
                Periodo:
                <select
                  value={periodoActual ? periodoActual.periodo : ""}
                  onChange={handlePeriodoChange}
                  className="block p-2 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {periodos.map((periodo) => (
                    <option key={periodo.periodo} value={periodo.periodo}>
                      {periodo.periodo}
                    </option>
                  ))}
                </select>
              </p>
            </div>
          )}
          {matricula && (
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
                      <Table.Cell>
                        {CurrencyFormatter(arancel.monto)}
                      </Table.Cell>
                      <Table.Cell>
                        {
                          Months[new Date(arancel.fecha_vencimiento).getMonth()]
                            .name
                        }
                      </Table.Cell>
                      <Table.Cell>{arancel.nro_cuota}</Table.Cell>
                      <Table.Cell>
                        {DateFormatter(new Date(arancel.fecha_vencimiento))}
                      </Table.Cell>
                      <Table.Cell>
                        {arancel.es_activo ? "Pendiente" : "Pagado"}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="6">
                      No se encontraron aranceles para este alumno.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default EstadoDeCuentaPage;
