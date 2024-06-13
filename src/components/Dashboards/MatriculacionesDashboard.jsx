import { useEffect, useState } from "react";
import { getMatricula } from "../../services/AcademicoService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MatriculacionesDashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      const grado = ""; // Puedes ajustar el grado si es necesario
      const search = ""; // Puedes ajustar el search si es necesario
      const page = ""; // Puedes ajustar el page si es necesario

      try {
        const [currentYearResponse, lastYearResponse] = await Promise.all([
          getMatricula(currentYear, grado, search, page),
          getMatricula(lastYear, grado, search, page),
        ]);

        const currentYearMatriculas = currentYearResponse.data;
        const lastYearMatriculas = lastYearResponse.data;

        const newMatriculasCurrentYear = currentYearMatriculas.length;
        const newMatriculasLastYear = lastYearMatriculas.length;

        const retainedStudents = currentYearMatriculas.filter((matricula) =>
          lastYearMatriculas.some(
            (lastYearMatricula) =>
              lastYearMatricula.id_alumno === matricula.id_alumno
          )
        ).length;

        const retentionRate = (retainedStudents / newMatriculasLastYear) * 100;
        const newStudentsRate =
          ((newMatriculasCurrentYear - retainedStudents) /
            newMatriculasCurrentYear) *
          100;

        setData([
          {
            name: "Año Anterior: " + lastYear,
            Matriculaciones: newMatriculasLastYear,
          },
          {
            name: "Año Actual: " + currentYear,
            Matriculaciones: newMatriculasCurrentYear,
          },
        ]);

        setStats({
          retentionRate: retentionRate.toFixed(2),
          newStudentsRate: newStudentsRate.toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching matriculas data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Estadísticas de Matriculaciones</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Matriculaciones" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <div>
        <h3>Porcentaje de Retención: {stats.retentionRate}%</h3>
        <h3>Porcentaje de Alumnos Nuevos: {stats.newStudentsRate}%</h3>
      </div>
    </div>
  );
};

export default MatriculacionesDashboard;
