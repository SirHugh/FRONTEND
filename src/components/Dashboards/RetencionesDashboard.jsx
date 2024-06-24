import { useEffect, useState } from "react";
import { getMatricula, getGrados } from "../../services/AcademicoService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F'];

const MatriculacionesDashboard = () => {
  const [dataRetention, setDataRetention] = useState([]);
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

        const lastGrade = Math.max(...grados.map(grado => grado.grado));
        const firstGrade = Math.min(...grados.map(grado => grado.grado));

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

        // Data for retention level chart
        setDataRetention([
          { name: 'Retenidos', value: retainedStudents },
          { name: 'No Retenidos', value: lastYearMatriculasExcludingLastGrade.length - retainedStudents },
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
      <ResponsiveContainer width="110%" height={300}>
        <PieChart>
          <Pie
            data={dataRetention}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {dataRetention.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3>Porcentaje de Retención: {stats.retentionRate}%</h3>
      </div>
    </div>
  );
};

export default MatriculacionesDashboard;
