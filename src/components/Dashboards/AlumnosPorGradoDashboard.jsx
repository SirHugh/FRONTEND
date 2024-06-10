import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getGrados, getMatricula } from '../../services/AcademicoService'; // Asegúrate de ajustar la ruta según tu estructura de proyecto

const AlumnosPorGradoDashboard = () => {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear(); // Obtener el año actual

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradosResponse = await getGrados();
        const grados = gradosResponse.data;

        const matriculacionesPorGrado = await Promise.all(grados.map(async (grado) => {
          const matriculasResponse = await getMatricula(currentYear, grado.id_grado, '', 1);
          return {
            grado: grado.nombre, // Asumiendo que el nombre del grado está en `nombre`
            cantidad: matriculasResponse.data.count, // Asumiendo que el conteo total está en `count`
          };
        }));

        setData(matriculacionesPorGrado);
      } catch (error) {
        console.error('Error fetching alumnos por grado data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cantidad de Alumnos por Grado año {currentYear}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grado" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlumnosPorGradoDashboard;
