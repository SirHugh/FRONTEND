import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getBecas, getBecadosBeca } from '../../services/AcademicoService'; // Ajusta la ruta según tu estructura de proyecto

const AlumnosPorBecaDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const becasResponse = await getBecas();
        const becas = becasResponse.data;

        const becadosPorBeca = await Promise.all(becas.map(async (beca) => {
          const becadosResponse = await getBecadosBeca(beca.id, '');
          return {
            beca: beca.nombre, // Asumiendo que el nombre de la beca está en `nombre`
            cantidad: becadosResponse.data.count, // Asumiendo que el conteo total está en `count`
          };
        }));

        setData(becadosPorBeca);
      } catch (error) {
        console.error('Error fetching alumnos por beca data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cantidad de Alumnos por Beca</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="beca" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlumnosPorBecaDashboard;
