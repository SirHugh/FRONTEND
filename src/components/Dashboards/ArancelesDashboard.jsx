import { useEffect, useState } from "react";
import { getArancel } from "../../services/CajaService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FF0000", "#00C49F"];

const ArancelesDashboard = () => {
  const [dataAranceles, setDataAranceles] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth = new Date().getMonth() + 1;
      const search = ""; // Puedes ajustar el search si es necesario
      const page = ""; // Puedes ajustar el page si es necesario

      try {
        const [activeResponse, inactiveResponse] = await Promise.all([
          getArancel(true, "", currentMonth, page, search),
          getArancel(false, "", currentMonth, page, search),
        ]);

        const activeAranceles = activeResponse.data.length;
        const inactiveAranceles = inactiveResponse.data.length;
        const totalAranceles = activeAranceles + inactiveAranceles;

        const activeRate = (activeAranceles / totalAranceles) * 100;
        const inactiveRate = (inactiveAranceles / totalAranceles) * 100;

        setDataAranceles([
          { name: "Pendientes", value: activeAranceles },
          { name: "Cancelados", value: inactiveAranceles },
        ]);

        setStats({
          activeRate: activeRate.toFixed(2),
          inactiveRate: inactiveRate.toFixed(2),
        });
      } catch (error) {
        console.error("Error fetching aranceles data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Aranceles del Mes</h2>

      <h3 className="text-lg font-semibold mb-4">Estado de los Aranceles</h3>
      <ResponsiveContainer width="110%" height={300}>
        <PieChart>
          <Pie
            data={dataAranceles}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
          >
            {dataAranceles.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3>Pendientes: {stats.activeRate}%</h3>
        <h3>Cancelados: {stats.inactiveRate}%</h3>
      </div>
    </div>
  );
};

export default ArancelesDashboard;
