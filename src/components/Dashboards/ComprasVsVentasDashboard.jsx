import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getCompra, getVenta } from '../../services/CajaService'; // Ajusta la ruta según tu estructura de proyecto

const ComprasVsVentasDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasResponse, ventasResponse] = await Promise.all([getCompra(), getVenta()]);
        
        const compras = comprasResponse.data;
        const ventas = ventasResponse.data;

        console.log('Datos de compras:', compras);
        console.log('Datos de ventas:', ventas);

        // Transformar datos para que sean compatibles con la gráfica
        const transformData = () => {
          const allDates = [...new Set([...compras.map(c => c.fecha), ...ventas.map(v => v.fecha)])];

          const formattedData = allDates.map(date => {
            const compraData = compras.filter(c => c.fecha === date).reduce((sum, c) => sum + parseFloat(c.monto), 0);
            const ventaData = ventas.filter(v => v.fecha === date).reduce((sum, v) => sum + parseFloat(v.monto), 0);

            return {
              date,
              compra: compraData,
              venta: ventaData
            };
          });

          return formattedData;
        };

        setData(transformData());
      } catch (error) {
        console.error('Error fetching compras vs ventas data:', error);
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
          <Line type="monotone" dataKey="compra" stroke="#8884d8" />
          <Line type="monotone" dataKey="venta" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComprasVsVentasDashboard;