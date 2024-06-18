import { useEffect, useState } from "react";
import { getMatricula, getGrados } from "../../services/AcademicoService";
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
  const [dataRetention, setDataRetention] = useState([]);
  const [dataFoundation, setDataFoundation] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      const search = ""; // Puedes ajustar el search si es necesario
      const page = ""; // Puedes ajustar el page si es necesario

      try {
        // Fetch grados to determine the first and last grades
        const gradosResponse = await getGrados();
        const grados = gradosResponse.data;
        const lastGrade = 9; // 9no grado
        const firstGrade = 1; // 1er grado

        const [currentYearResponse, lastYearResponse] = await Promise.all([
          getMatricula(currentYear, "", search, page),
          getMatricula(lastYear, "", search, page),
        ]);

        const currentYearMatriculas = currentYearResponse.data;
        const lastYearMatriculas = lastYearResponse.data;

        // Filter out first grade students from current year and last grade students from last year
        const lastYearMatriculasExcludingLastGrade = lastYearMatriculas.filter(
          (matricula) => matricula.id_grado.grado !== lastGrade
        );
        const currentYearMatriculasExcludingFirstGrade = currentYearMatriculas.filter(
          (matricula) => matricula.id_grado.grado !== firstGrade
        );

        // Calculate retained students
        const retainedStudents = currentYearMatriculasExcludingFirstGrade.filter((matricula) =>
          lastYearMatriculasExcludingLastGrade.some(
            (lastYearMatricula) =>
              lastYearMatricula.id_alumno.id_alumno === matricula.id_alumno.id_alumno
          )
        ).length;

        const retentionRate = (retainedStudents / lastYearMatriculasExcludingLastGrade.length) * 100;

        // Calculate new students rate
        const newStudentsCurrentYear = currentYearMatriculas.filter(
          (matricula) => !matricula.es_interno
        ).length;

        const newStudentsRate = (newStudentsCurrentYear / currentYearMatriculas.length) * 100;

        // Data for retention level chart
        setDataRetention([
          {
            name: "Año Anterior: " + lastYear,
            Matriculaciones: lastYearMatriculas.length,
            Retenidos: retainedStudents,
          },
        ]);

        setStats({
          retentionRate: retentionRate.toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching matriculas data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Estadísticas de matriculaciones</h2>

      <h3 className="text-lg font-semibold mb-4">Nivel de Retención</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataRetention}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Matriculaciones" fill="#8884d8" />
          <Bar dataKey="Retenidos" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3>Porcentaje de Retención: {stats.retentionRate}%</h3>
      </div>
    </div>
  );
};

export default MatriculacionesDashboard;
