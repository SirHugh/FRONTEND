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
      const page = ""; // Puedes ajustar el page si es necesario
      const id = ""; // Puedes ajustar el id si es necesario

      try {
        const response = await getFlujoCaja(id, page, currentMonth);
        const flujoCajaData = response.data;

        // Procesar los datos asegurando que monto_cierre sea numérico
        const processedData = flujoCajaData.map((item) => ({
          fecha: item.fecha,
          cierre: Number(item.monto_cierre), // Convertir a número
        }));

        setDataFlujoCaja(processedData);
      } catch (error) {
        console.error("Error fetching flujo de caja data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cierres de Flujo de Caja del Mes</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataFlujoCaja}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cierre" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FlujoCajaDashboard;
