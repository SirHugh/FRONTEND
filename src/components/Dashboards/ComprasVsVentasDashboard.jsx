import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { getFlujoCaja } from "../../services/CajaService"; // Ajusta la ruta según tu estructura de proyecto

const ComprasVsVentasDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFlujoCaja("", 1);
        const flujoCaja = response.data.results;

        // Transformar datos para que sean compatibles con la gráfica
        const transformData = () => {
          const formattedData = flujoCaja
            .map((flujo) => {
              const compraData = flujo.entrada;
              const ventaData = flujo.salida;
              const date = flujo.fecha.slice(8, 10);
              return {
                date,
                entrada: compraData,
                salida: ventaData,
              };
            })
            .reverse();

          return formattedData;
        };

        setData(transformData());
      } catch (error) {
        console.error("Error fetching compras vs ventas data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Compras vs Ventas</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="entrada" stroke="#8884d8" />
          <Line type="monotone" dataKey="salida" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComprasVsVentasDashboard;
