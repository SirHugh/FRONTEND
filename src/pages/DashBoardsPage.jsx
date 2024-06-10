import React from 'react';
import MatriculacionesDashboard from '../components/Dashboards/MatriculacionesDashboard';
import AlumnosPorGradoDashboard from '../components/Dashboards/AlumnosPorGradoDashboard';
import AlumnosPorBecaDashboard from '../components/Dashboards/AlumnosPorBecaDashboard';
// Importa otros dashboards aquí cuando estén disponibles

const DashBoardsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
          <MatriculacionesDashboard />
        </div>
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
          <AlumnosPorGradoDashboard />
        </div>
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow">
          <AlumnosPorBecaDashboard />
        </div>
        {/* Añade otros dashboards aquí */}
      </div>
    </div>
  );
};

export default DashBoardsPage;
