import { useEffect, useState } from "react";
import { getFlujoCaja } from "../../services/CajaService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const FlujoCajaDashboard = () => {
  const [dataFlujoCaja, setDataFlujoCaja] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentMonth = new Date().toISOString().slice(0, 7); // Obtener el mes en formato YYYY-MM
      const page = 1; // Puedes ajustar el page si es necesario
      const id = ""; // Puedes ajustar el id si es necesario

      try {
        const response = await getFlujoCaja(id, page);
        const flujoCajaData = response.data.results;

        // Procesar los datos asegurando que monto_cierre sea numérico
        const processedData = flujoCajaData
          .map((item) => ({
            fecha: item.fecha.slice(8, 10),
            cierre: Number(item.entrada - item.salida), // Convertir a número
          }))
          .reverse();

        setDataFlujoCaja(processedData);
      } catch (error) {
        console.error("Error fetching flujo de caja data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Balance Diario</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataFlujoCaja}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cierre" fill="#5684d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlujoCajaDashboard;
