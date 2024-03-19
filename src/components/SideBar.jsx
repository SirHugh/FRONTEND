import React from "react";

const SideBar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Registro de usuarios
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Asignación de accesos
            </a>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Gestión de alumnos</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Inscripción
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Desmatriculación
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Gestión de becas
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Padres y Responsables
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Configuración de Cuotas
            </a>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Caja</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Reportes de caja
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Facturación
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Apertura de caja
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Cierre de caja
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Registro de productos
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
